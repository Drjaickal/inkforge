// lib/api.ts
// All API calls match your Express backend exactly:
// POST /auth/login, POST /auth/register
// GET  /posts, GET /posts/:slug
// POST /posts, PUT /posts/:id, DELETE /posts/:id, PUT /posts/publish/:id
// GET  /search?q=

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// ─── Types matching your Prisma schema exactly ───────────────────────────────

export type Role       = 'ADMIN' | 'WRITER'
export type PostStatus = 'DRAFT' | 'PUBLISHED'

export interface ApiUser {
  id:        string
  email:     string
  role:      Role
  createdAt: string
}

export interface ApiPost {
  id:          string
  title:       string
  slug:        string
  content:     unknown        // Json in Prisma — your block editor JSON
  status:      PostStatus
  authorId:    string
  author:      ApiUser
  createdAt:   string
  publishedAt: string | null
}

export interface ApiResponse<T> {
  data?:    T
  message?: string
  error?:   string
}

export interface PaginatedPosts {
  posts:      ApiPost[]
  total:      number
  page:       number
  totalPages: number
}

// ─── Token helpers (stored in localStorage) ──────────────────────────────────

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('tcb_token')
}

export function setToken(token: string): void {
  localStorage.setItem('tcb_token', token)
}

export function removeToken(): void {
  localStorage.removeItem('tcb_token')
  localStorage.removeItem('tcb_user')
}

export function getStoredUser(): ApiUser | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('tcb_user')
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

export function setStoredUser(user: ApiUser): void {
  localStorage.setItem('tcb_user', JSON.stringify(user))
}

// ─── Base fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API}${path}`, { ...options, headers })

  // Handle 401 — token expired
  if (res.status === 401) {
    removeToken()
    if (typeof window !== 'undefined') window.location.href = '/login'
    throw new Error('Unauthorized — please log in again')
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || data.error || `Request failed: ${res.status}`)
  }

  return data
}

// ─── Auth API ─────────────────────────────────────────────────────────────────
// POST /auth/login   → { token, user }
// POST /auth/register → { token, user }

export const authApi = {
  async login(email: string, password: string): Promise<{ token: string; user: ApiUser }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  },

  async register(email: string, password: string, role: Role = 'WRITER'): Promise<{ token: string; user: ApiUser }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    })
  },

  logout(): void {
    removeToken()
    window.location.href = '/login'
  },
}

// ─── Posts API ────────────────────────────────────────────────────────────────
// GET    /posts            → ApiPost[]  (public, paginated)
// GET    /posts/:slug      → ApiPost    (public, published only)
// POST   /posts            → ApiPost    (auth required)
// PUT    /posts/:id        → ApiPost    (auth required)
// DELETE /posts/:id        → message   (auth required)
// PUT    /posts/publish/:id → ApiPost  (auth required)

export const postsApi = {
  // Public: get all published posts
  async getAll(params?: { page?: number; limit?: number; status?: PostStatus }): Promise<ApiPost[]> {
    const qs = new URLSearchParams()
    if (params?.page)   qs.set('page',   String(params.page))
    if (params?.limit)  qs.set('limit',  String(params.limit))
    if (params?.status) qs.set('status', params.status)
    const query = qs.toString() ? `?${qs}` : ''
    return request<ApiPost[]>(`/posts${query}`)
  },

  // Public: get single post by slug (published only)
  async getBySlug(slug: string): Promise<ApiPost> {
    return request<ApiPost>(`/posts/${slug}`)
  },

  // Admin: create new draft post (auth required)
  async create(data: {
    title: string
    slug: string
    content: unknown
    status?: PostStatus
  }): Promise<ApiPost> {
    return request<ApiPost>('/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    }, true)
  },

  // Admin: update post (auth required)
  async update(id: string, data: {
    title?: string
    slug?: string
    content?: unknown
    status?: PostStatus
  }): Promise<ApiPost> {
    return request<ApiPost>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }, true)
  },

  // Admin: publish post — triggers ISR revalidation (auth required)
  async publish(id: string): Promise<ApiPost> {
    return request<ApiPost>(`/posts/publish/${id}`, {
      method: 'PUT',
    }, true)
  },

  // Admin: delete post (auth required)
  async delete(id: string): Promise<{ message: string }> {
    return request<{ message: string }>(`/posts/${id}`, {
      method: 'DELETE',
    }, true)
  },
}

// ─── Search API ───────────────────────────────────────────────────────────────
// GET /search?q=keyword → ApiPost[]

export const searchApi = {
  async search(query: string): Promise<ApiPost[]> {
    if (!query.trim()) return []
    const qs = new URLSearchParams({ q: query })
    return request<ApiPost[]>(`/search?${qs}`)
  },
}

// ─── Cloudinary upload (client-side unsigned upload) ─────────────────────────
// Uses Cloudinary's unsigned upload API — no backend needed for images

export async function uploadImage(file: File): Promise<{
  url:       string
  publicId:  string
  width:     number
  height:    number
  format:    string
}> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  if (!cloudName) throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set in .env.local')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'tcb_unsigned') // create this in Cloudinary dashboard
  formData.append('folder', 'tcb/posts')

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) throw new Error('Cloudinary upload failed')

  const data = await res.json()
  return {
    url:      data.secure_url,
    publicId: data.public_id,
    width:    data.width,
    height:   data.height,
    format:   data.format,
  }
}
