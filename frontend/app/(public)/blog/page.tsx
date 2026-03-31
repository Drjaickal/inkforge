import type { Metadata } from 'next'
import Link from 'next/link'
import { MOCK_POSTS, MOCK_CATEGORIES } from '@/lib/data'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'The Corporate Blog',
  description: 'In-depth writing on technology, engineering, design, and business.',
}

export default function BlogHomePage() {
  const featured = MOCK_POSTS[0]
  const rest = MOCK_POSTS.slice(1).filter(p => p.status === 'PUBLISHED')

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px' }}>

      <section style={{ marginBottom: 80 }}>
        <div style={{ marginBottom: 32 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--accent)',
            border: '1px solid rgba(200,184,154,0.25)', padding: '4px 10px',
            borderRadius: 20, marginBottom: 24,
          }}>
            Featured
          </span>
          <PostCard post={featured} variant="featured" />
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, alignItems: 'start' }}>
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Latest</h2>
            <Link href="/blog" style={{ fontSize: 13, color: 'var(--accent)' }}>All posts →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {rest.map((post, i) => (
              <div key={post.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.08}s both` }}>
                <PostCard post={post} />
              </div>
            ))}
          </div>
        </section>

        <aside style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Browse by topic</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {MOCK_CATEGORIES.map(cat => (
                <Link key={cat.id} href={`/blog/category/${cat.slug}`} className="cat-link">
                  <span>{cat.name}</span>
                  <span className="cat-count">{cat.postCount}</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Trending now</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {MOCK_POSTS.filter(p => p.status === 'PUBLISHED').slice(0, 3).map((post) => (
                <PostCard key={post.id} post={post} variant="compact" />
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(200,184,154,0.2)', borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 8, color: 'var(--accent-bright)' }}>Stay in the loop</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>Get the best articles delivered to your inbox. No spam.</p>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input type="email" placeholder="you@company.com" style={{ width: '100%', height: 38, padding: '0 12px', borderRadius: 8, border: '1px solid var(--border-light)', background: 'var(--bg-overlay)', color: 'var(--text-primary)', fontSize: 13 }} />
              <button type="submit" style={{ height: 38, borderRadius: 8, background: 'var(--accent)', color: '#0C0C0E', fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none' }}>Subscribe</button>
            </form>
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .cat-link { display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; border-radius: 8px; font-size: 14px; color: var(--text-secondary); transition: all 150ms; text-decoration: none; }
        .cat-link:hover { background: var(--bg-hover); color: var(--text-primary); }
        .cat-count { font-size: 12px; color: var(--text-muted); background: var(--bg-overlay); padding: 2px 6px; border-radius: 4px; }
      `}</style>
    </main>
  )
}
