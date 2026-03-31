import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_POSTS, MOCK_AUTHOR, formatNumber } from '@/lib/data'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 900

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return [{ slug: MOCK_AUTHOR.slug }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug !== MOCK_AUTHOR.slug) return {}
  return {
    title: `${MOCK_AUTHOR.name} — Author`,
    description: MOCK_AUTHOR.bio,
    alternates: { canonical: `/blog/author/${slug}` },
  }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params

  if (slug !== MOCK_AUTHOR.slug) notFound()
  const author = MOCK_AUTHOR

  const posts = MOCK_POSTS.filter(p => p.status === 'PUBLISHED' && p.author.slug === slug)
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    description: author.bio,
    image: author.avatar,
    url: `/blog/author/${author.slug}`,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>
        <nav style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 48 }}>
          <Link href="/blog" style={{ color: 'var(--text-secondary)' }}>Blog</Link>
          <span>/</span>
          <span>{author.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 32, alignItems: 'center', marginBottom: 64, paddingBottom: 64, borderBottom: '1px solid var(--border)' }}>
          {author.avatar ? (
            <img src={author.avatar} alt={author.name} style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-light)' }} />
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'rgba(200,184,154,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, color: 'var(--accent)' }}>
              {author.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
            </div>
          )}
          <div>
            <div style={{ display: 'inline-block', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', border: '1px solid rgba(200,184,154,0.25)', padding: '3px 10px', borderRadius: 20, marginBottom: 12 }}>Author</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 12 }}>{author.name}</h1>
            {author.bio && <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.65, maxWidth: 560, marginBottom: 20 }}>{author.bio}</p>}
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{posts.length}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Articles</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{formatNumber(totalViews)}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total views</div>
              </div>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 28 }}>
          Articles by {author.name}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {posts.map((post, i) => (
            <div key={post.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.07}s both` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </main>

      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }`}</style>
    </>
  )
}
