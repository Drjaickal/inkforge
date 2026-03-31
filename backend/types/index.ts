export type UserRole = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'VIEWER'

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  slug: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  postCount?: number
}

export interface Image {
  id: string
  url: string
  alt: string
  caption?: string
  width: number
  height: number
}

export type BlockType =
  | 'heading'
  | 'paragraph'
  | 'list'
  | 'ordered-list'
  | 'image'
  | 'blockquote'
  | 'table'
  | 'code'
  | 'divider'
  | 'callout'
  | 'faq'
  | 'youtube'

export interface Block {
  id: string
  type: BlockType
  content: unknown
  order: number
}

export interface HeadingBlock extends Block {
  type: 'heading'
  content: { level: 1|2|3|4|5|6; text: string }
}

export interface ParagraphBlock extends Block {
  type: 'paragraph'
  content: { html: string }
}

export interface ListBlock extends Block {
  type: 'list' | 'ordered-list'
  content: { items: string[] }
}

export interface ImageBlock extends Block {
  type: 'image'
  content: Image
}

export interface BlockquoteBlock extends Block {
  type: 'blockquote'
  content: { text: string; cite?: string }
}

export interface CalloutBlock extends Block {
  type: 'callout'
  content: { text: string; variant: 'info' | 'warning' | 'success' | 'error' }
}

export interface FAQBlock extends Block {
  type: 'faq'
  content: { items: Array<{ question: string; answer: string }> }
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  status: PostStatus
  blocks: Block[]
  author: User
  categories: Category[]
  banner?: Image
  readingTime?: number
  wordCount?: number
  views?: number
  publishedAt?: string
  scheduledAt?: string
  createdAt: string
  updatedAt: string
  seoTitle?: string
  seoDescription?: string
  canonicalUrl?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface SearchResult {
  posts: Post[]
  query: string
  total: number
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface TOCItem {
  id: string
  text: string
  level: 2 | 3
}

export interface DashboardStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  totalViews: number
  monthlyViews: number
  topPosts: Post[]
}
