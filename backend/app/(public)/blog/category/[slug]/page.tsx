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
  const cat = MOCK_CATEGORIES.find(c => c.slug === slug)
  if (!cat) return {}
  return { title:`${cat.name} — The Corporate Blog`, description:`Articles on ${cat.name}.`,
    alternates:{ canonical:`/blog/category/${slug}` } }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const cat = MOCK_CATEGORIES.find(c => c.slug === slug)
  if (!cat) notFound()
  const posts = MOCK_POSTS.filter(p => p.status==='PUBLISHED' && p.categories.some(c => c.slug===slug))

  return (
    <main style={{ maxWidth:'var(--wide)', margin:'0 auto', padding:'48px 28px 96px' }}>
      {/* Breadcrumb */}
      <nav style={{ display:'flex', gap:8, fontSize:12, color:'var(--text-4)', marginBottom:44 }}>
        <Link href="/blog" style={{ color:'var(--text-3)' }}>Blog</Link>
        <span>/</span><span>{cat.name}</span>
      </nav>

      {/* Header */}
      <header style={{ marginBottom:52 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginBottom:18,
          padding:'4px 12px', borderRadius:99, background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
          <span style={{ fontSize:11, color:'var(--gold)', fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase' }}>Category</span>
        </div>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:48, fontWeight:500,
          letterSpacing:'-.03em', lineHeight:1.1, marginBottom:16, color:'var(--text-1)' }}>
          {cat.name}
        </h1>
        <p style={{ fontSize:16, color:'var(--text-2)', marginBottom:0 }}>
          {posts.length} {posts.length===1?'article':'articles'} published
        </p>
      </header>

      {/* Category pills */}
      <div style={{ display:'flex', gap:8, marginBottom:48, flexWrap:'wrap' }}>
        {MOCK_CATEGORIES.map(c => (
          <Link key={c.id} href={`/blog/category/${c.slug}`} style={{
            padding:'6px 16px', borderRadius:99, fontSize:12, fontWeight:500, textDecoration:'none',
            border:`1px solid ${c.slug===slug ? 'var(--gold-border)' : 'var(--border)'}`,
            background: c.slug===slug ? 'var(--gold-dim)' : 'transparent',
            color: c.slug===slug ? 'var(--gold)' : 'var(--text-3)',
            transition:`all var(--t-fast)`,
          }}>
            {c.name}
          </Link>
        ))}
      </div>

      {/* Posts */}
      {posts.length===0 ? (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <p style={{ fontSize:16, color:'var(--text-3)', marginBottom:20 }}>No articles in this category yet.</p>
          <Link href="/blog" style={{ fontSize:13, color:'var(--gold)', fontWeight:500 }}>Browse all articles →</Link>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))', gap:20 }}>
          {posts.map((post,i) => (
            <div key={post.id} style={{ animation:`fadeUp .4s var(--ease) ${i*.06}s both` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      )}
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }`}</style>
    </main>
  )
}
