// app/(public)/blog/page.tsx
// Fetches real posts from GET http://localhost:5000/posts
import type { Metadata } from 'next'
import Link from 'next/link'
import { postsApi } from '@/lib/api'
import type { ApiPost } from '@/lib/api'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'The Corporate Blog — Technology, Engineering & Business',
  description: 'In-depth writing on technology, engineering, design, and business strategy.',
}

// Your Prisma content Json field may contain these optional fields
interface PostContent {
  excerpt?:    string
  readingTime?: number
  wordCount?:  number
  banner?:     { url: string; alt: string; width: number; height: number }
  blocks?:     unknown[]
}

function mapPost(p: ApiPost) {
  const c = (p.content || {}) as PostContent
  return {
    id:          p.id,
    title:       p.title,
    slug:        p.slug,
    excerpt:     c.excerpt || '',
    status:      p.status as 'PUBLISHED' | 'DRAFT',
    blocks:      c.blocks || [],
    author: {
      id:    p.author.id,
      name:  p.author.email.split('@')[0],
      email: p.author.email,
      role:  p.author.role as 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'VIEWER',
      slug:  p.author.id,
    },
    categories:  [] as any[],
    banner:      c.banner,
    readingTime: c.readingTime,
    wordCount:   c.wordCount,
    views:       0,
    publishedAt: p.publishedAt ?? undefined,
    createdAt:   p.createdAt,
    updatedAt:   p.createdAt,
  }
}

export default async function BlogHomePage() {
  let posts: ApiPost[] = []
  try {
    posts = await postsApi.getAll({ status: 'PUBLISHED' })
  } catch (err) {
    console.error('Failed to fetch posts from backend:', err)
  }

  const mapped   = posts.map(mapPost)
  const featured = mapped[0]
  const rest     = mapped.slice(1)

  return (
    <main style={{ maxWidth:'var(--wide)', margin:'0 auto', padding:'56px 28px 96px' }}>
      <div style={{ marginBottom:48 }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:7, marginBottom:20,
          padding:'5px 12px', borderRadius:99, background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--gold)', animation:'pulse 2s infinite' }} />
          <span style={{ fontSize:11, color:'var(--gold)', fontWeight:500, letterSpacing:'.06em' }}>Latest stories</span>
        </div>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:44, fontWeight:500, lineHeight:1.12,
          letterSpacing:'-.03em', color:'var(--text-1)', marginBottom:16 }}>
          Ideas that move<br/><span style={{ color:'var(--gold)' }}>industry forward.</span>
        </h1>
        <p style={{ fontSize:16, color:'var(--text-2)', maxWidth:480, lineHeight:1.7 }}>
          Deeply researched articles on software engineering, product strategy, and the business of technology.
        </p>
      </div>

      {mapped.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <p style={{ fontSize:18, color:'var(--text-3)', marginBottom:16 }}>No articles published yet.</p>
          <Link href="/admin/posts/new" style={{ fontSize:14, color:'var(--gold)', fontWeight:500 }}>Write the first post →</Link>
        </div>
      )}

      {featured && (
        <div style={{ marginBottom:56 }}>
          <PostCard post={featured as any} variant="featured" />
        </div>
      )}

      {rest.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 304px', gap:52, alignItems:'start' }}>
          <section>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:26 }}>
              <span style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text-4)' }}>Recent articles</span>
              <Link href="/blog" style={{ fontSize:12, color:'var(--gold)', fontWeight:500 }}>View all →</Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
              {rest.map((post, i) => (
                <div key={post.id} style={{ animation:`fadeUp .45s var(--ease) ${i*.07}s both` }}>
                  <PostCard post={post as any} />
                </div>
              ))}
            </div>
          </section>
          <aside style={{ display:'flex', flexDirection:'column', gap:24 }}>
            <div style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'20px 18px' }}>
              <p style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text-4)', marginBottom:4 }}>Trending</p>
              {mapped.slice(0, 4).map(post => <PostCard key={post.id} post={post as any} variant="compact" />)}
            </div>
            <div style={{ background:'var(--bg-2)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-lg)', padding:'22px 20px' }}>
              <h3 style={{ fontSize:15, fontWeight:600, color:'var(--text-1)', marginBottom:8 }}>Weekly digest</h3>
              <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65, marginBottom:18 }}>The week's best articles, curated and delivered every Sunday.</p>
              <form style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <input type="email" placeholder="your@email.com" style={{ width:'100%', height:38, padding:'0 13px', borderRadius:'var(--r-md)', border:'1px solid var(--border-md)', background:'var(--bg-1)', color:'var(--text-1)', fontSize:13, outline:'none' }} />
                <button type="submit" style={{ height:38, borderRadius:'var(--r-md)', background:'var(--gold)', color:'#0A0A0B', fontSize:13, fontWeight:600, cursor:'pointer', border:'none' }}>Subscribe free</button>
              </form>
            </div>
          </aside>
        </div>
      )}
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}`}</style>
    </main>
  )
}
