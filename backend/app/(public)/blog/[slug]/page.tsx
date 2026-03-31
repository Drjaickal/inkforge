// app/(public)/blog/[slug]/page.tsx
// Fetches single post from GET http://localhost:5000/posts/:slug
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { postsApi } from '@/lib/api'
import type { ApiPost } from '@/lib/api'
import { Badge } from '@/components/ui'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 900
interface Props { params: Promise<{ slug: string }> }

interface PostContent {
  excerpt?:    string
  readingTime?: number
  wordCount?:  number
  banner?:     { url: string; alt: string; caption?: string; width: number; height: number }
  blocks?:     unknown[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await postsApi.getBySlug(slug)
    const c = (post.content || {}) as PostContent
    return {
      title: post.title,
      description: c.excerpt,
      openGraph: { title: post.title, description: c.excerpt,
        images: c.banner ? [{ url: c.banner.url }] : [],
        type: 'article', publishedTime: post.publishedAt ?? undefined },
      alternates: { canonical: `/blog/${slug}` },
    }
  } catch { return {} }
}

function formatDate(str: string) {
  return new Intl.DateTimeFormat('en-US', { year:'numeric', month:'long', day:'numeric' }).format(new Date(str))
}

const TOC = [
  { id:'intro',     text:'Introduction',         level:2 },
  { id:'context',   text:'Background & context', level:2 },
  { id:'details',   text:'The core details',     level:2 },
  { id:'takeaways', text:'Key takeaways',         level:2 },
]

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  let post: ApiPost
  try {
    post = await postsApi.getBySlug(slug)
  } catch {
    notFound()
  }

  if (post.status !== 'PUBLISHED') notFound()

  const c = (post.content || {}) as PostContent

  const jsonLd = {
    '@context':'https://schema.org', '@type':'Article',
    headline: post.title, description: c.excerpt,
    author: { '@type':'Person', name: post.author.email.split('@')[0] },
    datePublished: post.publishedAt, dateModified: post.createdAt,
    image: c.banner?.url,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div style={{ maxWidth:'var(--wide)', margin:'0 auto', padding:'20px 28px 0' }}>
        <nav style={{ display:'flex', gap:8, alignItems:'center', fontSize:12, color:'var(--text-4)' }}>
          <Link href="/blog" style={{ color:'var(--text-3)' }}>Blog</Link>
          <span>/</span>
          <span style={{ color:'var(--text-4)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:280 }}>
            {post.title}
          </span>
        </nav>
      </div>

      <main style={{ maxWidth:'var(--wide)', margin:'0 auto', padding:'36px 28px 96px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 252px', gap:60, alignItems:'start' }}>

          <article>
            <header style={{ marginBottom:40 }}>
              <h1 style={{ fontFamily:'var(--font-serif)', fontSize:40, fontWeight:500,
                lineHeight:1.14, letterSpacing:'-.03em', color:'var(--text-1)', marginBottom:20 }}>
                {post.title}
              </h1>
              {c.excerpt && (
                <p style={{ fontSize:18, color:'var(--text-2)', lineHeight:1.72, marginBottom:28,
                  fontWeight:300, borderBottom:'1px solid var(--border)', paddingBottom:28 }}>
                  {c.excerpt}
                </p>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:'var(--gold-dim)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'var(--gold)', fontSize:16, fontWeight:600, flexShrink:0 }}>
                  {post.author.email[0].toUpperCase()}
                </div>
                <div>
                  <span style={{ fontSize:14, fontWeight:500, color:'var(--text-1)', display:'block' }}>
                    {post.author.email.split('@')[0]}
                  </span>
                  <div style={{ display:'flex', gap:12, marginTop:3 }}>
                    {post.publishedAt && <span style={{ fontSize:12, color:'var(--text-3)' }}>{formatDate(post.publishedAt)}</span>}
                    {c.readingTime && <span style={{ fontSize:12, color:'var(--text-3)' }}>· {c.readingTime} min read</span>}
                  </div>
                </div>
              </div>
            </header>

            {c.banner && (
              <figure style={{ marginBottom:40, borderRadius:'var(--r-xl)', overflow:'hidden' }}>
                <img src={c.banner.url} alt={c.banner.alt || post.title} style={{ width:'100%', height:'auto', display:'block' }} />
                {c.banner.caption && (
                  <figcaption style={{ fontSize:12, color:'var(--text-3)', padding:'10px 0 0', textAlign:'center', fontStyle:'italic' }}>
                    {c.banner.caption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Render content blocks if they exist, otherwise show raw content */}
            <div className="prose">
              {c.blocks && c.blocks.length > 0
                ? <BlockRenderer blocks={c.blocks as any[]} />
                : <p style={{ color:'var(--text-2)' }}>
                    {typeof post.content === 'string' ? post.content : JSON.stringify(post.content)}
                  </p>
              }
            </div>

            <div style={{ marginTop:48, paddingTop:28, borderTop:'1px solid var(--border)', display:'flex', gap:8, flexWrap:'wrap' }}>
              <Badge variant="category">#article</Badge>
            </div>
          </article>

          {/* Sidebar */}
          <aside style={{ position:'sticky', top:80, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'18px 16px' }}>
              <p style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text-4)', marginBottom:14 }}>Contents</p>
              <nav style={{ display:'flex', flexDirection:'column', gap:1 }}>
                {TOC.map(item => (
                  <a key={item.id} href={`#${item.id}`} style={{
                    display:'block', padding:'7px 10px', borderRadius:'var(--r-md)',
                    fontSize:12, color:'var(--text-3)', textDecoration:'none', transition:'color var(--t-fast)',
                  }}>
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>

            <div style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'18px 16px' }}>
              <p style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.09em', color:'var(--text-4)', marginBottom:12 }}>Share</p>
              {['Twitter / X','LinkedIn','Copy link'].map(s => (
                <button key={s} style={{ width:'100%', padding:'8px 12px', borderRadius:'var(--r-md)',
                  border:'1px solid var(--border)', fontSize:12, color:'var(--text-2)',
                  background:'transparent', cursor:'pointer', textAlign:'left', marginBottom:6 }}>
                  {s}
                </button>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </>
  )
}

// Renders your block editor JSON content
function BlockRenderer({ blocks }: { blocks: any[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        if (block.type === 'paragraph')
          return <p key={i}>{block.content?.html || block.content?.text || ''}</p>
        if (block.type === 'heading')
          return <h2 key={i} id={`h-${i}`}>{block.content?.text || ''}</h2>
        if (block.type === 'blockquote')
          return <blockquote key={i}><p>{block.content?.text || ''}</p></blockquote>
        if (block.type === 'image' && block.content?.url)
          return <figure key={i}><img src={block.content.url} alt={block.content.alt || ''} /></figure>
        if (block.type === 'list')
          return <ul key={i}>{(block.content?.items || []).map((item: string, j: number) => <li key={j}>{item}</li>)}</ul>
        if (block.type === 'ordered-list')
          return <ol key={i}>{(block.content?.items || []).map((item: string, j: number) => <li key={j}>{item}</li>)}</ol>
        if (block.type === 'divider')
          return <hr key={i} />
        if (block.type === 'code')
          return <pre key={i}><code>{block.content?.code || ''}</code></pre>
        return null
      })}
    </>
  )
}
