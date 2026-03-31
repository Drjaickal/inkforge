import type { Post, User, Category, DashboardStats } from '@/types'

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', postCount: 24 },
  { id: '2', name: 'Business', slug: 'business', postCount: 18 },
  { id: '3', name: 'Design', slug: 'design', postCount: 12 },
  { id: '4', name: 'Engineering', slug: 'engineering', postCount: 31 },
  { id: '5', name: 'Product', slug: 'product', postCount: 9 },
]

export const MOCK_AUTHOR: User = {
  id: '1',
  name: 'Alexandra Chen',
  email: 'alex@thecorporateblog.com',
  role: 'EDITOR',
  slug: 'alexandra-chen',
  bio: 'Senior technology writer covering enterprise software and digital transformation.',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face',
}

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'The architecture decisions that helped us scale to 10 million users',
    slug: 'architecture-decisions-scale-10-million-users',
    excerpt: 'A deep dive into the technical choices, trade-offs, and lessons learned as we grew our platform from a weekend side project to a production system serving millions.',
    status: 'PUBLISHED',
    blocks: [],
    author: MOCK_AUTHOR,
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[3]],
    banner: {
      id: '1',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop',
      alt: 'Server architecture diagram',
      width: 1200,
      height: 600,
    },
    readingTime: 12,
    wordCount: 2800,
    views: 48200,
    publishedAt: '2024-03-15T10:00:00Z',
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Why we rewrote our frontend in Next.js App Router',
    slug: 'rewrote-frontend-nextjs-app-router',
    excerpt: 'After two years with the Pages Router, we migrated to the App Router. Here is what changed, what broke, and whether it was worth it.',
    status: 'PUBLISHED',
    blocks: [],
    author: MOCK_AUTHOR,
    categories: [MOCK_CATEGORIES[0], MOCK_CATEGORIES[2]],
    banner: {
      id: '2',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop',
      alt: 'Code on screen',
      width: 1200,
      height: 600,
    },
    readingTime: 8,
    wordCount: 1900,
    views: 31500,
    publishedAt: '2024-03-08T09:00:00Z',
    createdAt: '2024-03-05T08:00:00Z',
    updatedAt: '2024-03-08T09:00:00Z',
  },
  {
    id: '3',
    title: 'Building a design system from scratch: a year in review',
    slug: 'building-design-system-year-review',
    excerpt: 'One year ago we started building a unified design system across our product suite. This is what we built, what failed, and what we would do differently.',
    status: 'PUBLISHED',
    blocks: [],
    author: MOCK_AUTHOR,
    categories: [MOCK_CATEGORIES[2], MOCK_CATEGORIES[4]],
    banner: {
      id: '3',
      url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop',
      alt: 'Design system components',
      width: 1200,
      height: 600,
    },
    readingTime: 10,
    wordCount: 2400,
    views: 22800,
    publishedAt: '2024-02-28T11:00:00Z',
    createdAt: '2024-02-22T08:00:00Z',
    updatedAt: '2024-02-28T11:00:00Z',
  },
  {
    id: '4',
    title: 'PostgreSQL full-text search in production: lessons from the trenches',
    slug: 'postgresql-full-text-search-production',
    excerpt: 'We ditched Elasticsearch and went all-in on PostgreSQL tsvector. Six months later, here is the honest truth about performance, trade-offs, and when to reconsider.',
    status: 'PUBLISHED',
    blocks: [],
    author: MOCK_AUTHOR,
    categories: [MOCK_CATEGORIES[3]],
    banner: {
      id: '4',
      url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&h=600&fit=crop',
      alt: 'Database visualization',
      width: 1200,
      height: 600,
    },
    readingTime: 14,
    wordCount: 3200,
    views: 19100,
    publishedAt: '2024-02-14T10:00:00Z',
    createdAt: '2024-02-10T08:00:00Z',
    updatedAt: '2024-02-14T10:00:00Z',
  },
  {
    id: '5',
    title: 'The quiet crisis in enterprise product management',
    slug: 'quiet-crisis-enterprise-product-management',
    excerpt: 'Product teams are drowning in process, misaligned on outcomes, and struggling to ship. We need to talk about what is actually broken.',
    status: 'DRAFT',
    blocks: [],
    author: MOCK_AUTHOR,
    categories: [MOCK_CATEGORIES[4], MOCK_CATEGORIES[1]],
    readingTime: 7,
    wordCount: 1600,
    views: 0,
    createdAt: '2024-03-18T08:00:00Z',
    updatedAt: '2024-03-20T14:30:00Z',
  },
]

export const MOCK_STATS: DashboardStats = {
  totalPosts: 47,
  publishedPosts: 38,
  draftPosts: 9,
  totalViews: 284500,
  monthlyViews: 48200,
  topPosts: MOCK_POSTS.slice(0, 3),
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr))
}

export function formatRelativeDate(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return formatDate(dateStr)
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
