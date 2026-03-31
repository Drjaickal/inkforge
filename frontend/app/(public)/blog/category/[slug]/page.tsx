import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/lib/data'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 900

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return MOCK_CATEGORIES.map(c => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = MOCK_CATEGORIES.find(c => c.slug === slug)
  if (!category) return {}
  return {
    title: `${category.name} articles`,
    description: `Read all articles in the ${category.name} category.`,
    alternates: { canonical: `/blog/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  const category = MOCK_CATEGORIES.find(c => c.slug === slug)
  if (!category) notFound()

  const posts = MOCK_POSTS.filter(p =>
    p.status === 'PUBLISHED' &&
    p.categories.some(c => c.slug === slug)
  )

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
      <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)', marginBottom: 40 }}>
        <Link href="/blog" style={{ color: 'var(--text-secondary)' }}>Blog</Link>
        <span>/</span>
        <span>{category.name}</span>
      </nav>

      <header style={{ marginBottom: 56 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', border: '1px solid rgba(200,184,154,0.25)', padding: '4px 10px', borderRadius: 20, marginBottom: 20 }}>
          Category
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 400, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 16 }}>
          {category.name}
        </h1>
        {category.description && (
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, lineHeight: 1.65 }}>{category.description}</p>
        )}
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 12 }}>
          {posts.length} {posts.length === 1 ? 'article' : 'articles'}
        </p>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
        {MOCK_CATEGORIES.map(cat => (
          <Link
            key={cat.id}
            href={`/blog/category/${cat.slug}`}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13,
              border: `1px solid ${cat.slug === slug ? 'rgba(200,184,154,0.5)' : 'var(--border)'}`,
              background: cat.slug === slug ? 'rgba(200,184,154,0.1)' : 'transparent',
              color: cat.slug === slug ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'all 150ms', textDecoration: 'none',
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: 16 }}>No published articles in this category yet.</p>
          <Link href="/blog" style={{ marginTop: 16, display: 'inline-block', color: 'var(--accent)', fontSize: 14 }}>Browse all articles →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {posts.map((post, i) => (
            <div key={post.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.06}s both` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }`}</style>
    </main>
  )
}
