const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export type Role = 'ADMIN' | 'WRITER'
export type PostStatus = 'DRAFT' | 'PUBLISHED'

export interface ApiUser {
    id: string
    email: string
    name?: string
    role: Role
    createdAt: string
}

export interface ApiPost {
    id: string
    title: string
    slug: string
    content: unknown
    status: PostStatus
    authorId: string
    author: ApiUser
    createdAt: string
    publishedAt: string | null
}

// ── Token helpers ─────────────────────────────────────────────────────────────

export function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('tcb_token')
}

export function setToken(token: string): void {
    localStorage.setItem('tcb_token', token)
    document.cookie = `tcb_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`
}

export function removeToken(): void {
    localStorage.removeItem('tcb_token')
    localStorage.removeItem('tcb_user')
    document.cookie = 'tcb_token=; path=/; max-age=0'
}

export function getStoredUser(): ApiUser | null {
    if (typeof window === 'undefined') return null
    try {
        return JSON.parse(localStorage.getItem('tcb_user') || '')
    } catch {
        return null
    }
}

export function setStoredUser(user: ApiUser): void {
    localStorage.setItem('tcb_user', JSON.stringify(user))
}

// ── Base fetch ────────────────────────────────────────────────────────────────

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
    const data = await res.json()

    if (res.status === 401) {
        removeToken()
        if (typeof window !== 'undefined') window.location.href = '/login'
        throw new Error('Unauthorized')
    }

    if (!res.ok) {
        throw new Error(data.message || data.error || `Error ${res.status}`)
    }

    return data
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
    async login(email: string, password: string): Promise<{ token: string; user: ApiUser }> {
        return request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
    },

    async register(
        email: string,
        password: string,
        role: Role = 'WRITER'
    ): Promise<{ token: string; user: ApiUser }> {
        return request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
        })
    },

    logout() {
        removeToken()
        window.location.href = '/login'
    },
}

// ── Posts ─────────────────────────────────────────────────────────────────────

export const postsApi = {
    async getAll(params?: { status?: PostStatus }): Promise<ApiPost[]> {
        const qs = params?.status ? `?status=${params.status}` : ''
        return request<ApiPost[]>(`/posts${qs}`)
    },

    async getBySlug(slug: string): Promise<ApiPost> {
        return request<ApiPost>(`/posts/${slug}`)
    },

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

    async publish(id: string): Promise<ApiPost> {
        return request<ApiPost>(`/posts/publish/${id}`, {
            method: 'PUT',
        }, true)
    },

    async delete(id: string): Promise<{ message: string }> {
        return request<{ message: string }>(`/posts/${id}`, {
            method: 'DELETE',
        }, true)
    },
}

// ── Search ────────────────────────────────────────────────────────────────────

export const searchApi = {
    async search(query: string): Promise<ApiPost[]> {
        if (!query.trim()) return []
        return request<ApiPost[]>(`/search?q=${encodeURIComponent(query)}`)
    },
}

// ── Cloudinary upload ─────────────────────────────────────────────────────────

export async function uploadImage(file: File): Promise<{
    url: string
    width: number
    height: number
}> {
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    if (!cloud) throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set in .env.local')

    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', 'tcb_unsigned')
    form.append('folder', 'tcb/posts')

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
        { method: 'POST', body: form }
    )

    if (!res.ok) throw new Error('Upload failed — check your Cloudinary preset name')

    const d = await res.json()
    return {
        url: d.secure_url,
        width: d.width,
        height: d.height,
    }
}