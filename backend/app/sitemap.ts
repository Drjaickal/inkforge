import { MetadataRoute } from 'next'
import { MOCK_POSTS, MOCK_CATEGORIES, MOCK_AUTHOR } from '@/lib/data'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thecorporateblog.com'

  const postUrls = MOCK_POSTS
    .filter(p => p.status === 'PUBLISHED')
    .map(p => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const categoryUrls = MOCK_CATEGORIES.map(c => ({
    url: `${base}/blog/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const authorUrls = [{
    url: `${base}/blog/author/${MOCK_AUTHOR.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }]

  return [
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ...postUrls,
    ...categoryUrls,
    ...authorUrls,
  ]
}
