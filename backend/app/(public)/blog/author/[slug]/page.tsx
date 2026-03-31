import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_POSTS, MOCK_AUTHOR, formatNumber } from '@/lib/data'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 900
interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() { return [{ slug: MOCK_AUTHOR.slug }] }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug !== MOCK_AUTHOR.slug) return {}
  return { title:`${MOCK_AUTHOR.name} — The Corporate Blog`, description:MOCK_AUTHOR.bio,
    alternates:{ canonical:`/blog/author/${slug}` } }
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params
  if (slug !== MOCK_AUTHOR.slug) notFound()
  const author = MOCK_AUTHOR
  const posts = MOCK_POSTS.filter(p => p.status==='PUBLISHED' && p.author.slug===slug)
  const totalViews = posts.reduce((s,p) => s+(p.views||0), 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html:JSON.stringify({
        '@context':'https://schema.org','@type':'Person',
        name:author.name, description:author.bio, image:author.avatar,
        url:`/blog/author/${author.slug}`,
      })}} />
      <main style={{ maxWidth:'var(--wide)', margin:'0 auto', padding:'48px 28px 96px' }}>
        <nav style={{ display:'flex', gap:8, fontSize:12, color:'var(--text-4)', marginBottom:44 }}>
          <Link href="/blog" style={{ color:'var(--text-3)' }}>Blog</Link>
          <span>/</span><span>{author.name}</span>
        </nav>

        {/* Author hero */}
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:32, alignItems:'center',
          marginBottom:64, paddingBottom:52, borderBottom:'1px solid var(--border)' }}>
          {author.avatar
            ? <img src={author.avatar} alt={author.name}
                style={{ width:100, height:100, borderRadius:'50%', objectFit:'cover',
                  border:'3px solid var(--border-md)', boxShadow:'0 0 0 4px var(--bg-2)' }} />
            : <div style={{ width:100, height:100, borderRadius:'50%', background:'var(--gold-dim)',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:36, color:'var(--gold)', fontFamily:'var(--font-serif)', fontWeight:500 }}>
                {author.name.split(' ').map((w:string)=>w[0]).join('').slice(0,2)}
              </div>
          }
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginBottom:12,
              padding:'4px 12px', borderRadius:99, background:'var(--gold-dim)', border:'1px solid var(--gold-border)' }}>
              <span style={{ fontSize:11, color:'var(--gold)', fontWeight:500, letterSpacing:'.06em', textTransform:'uppercase' }}>Author</span>
            </div>
            <h1 style={{ fontFamily:'var(--font-serif)', fontSize:40, fontWeight:500,
              letterSpacing:'-.025em', lineHeight:1.15, marginBottom:12, color:'var(--text-1)' }}>
              {author.name}
            </h1>
            {author.bio && <p style={{ fontSize:15, color:'var(--text-2)', lineHeight:1.7, maxWidth:520, marginBottom:22 }}>{author.bio}</p>}
            <div style={{ display:'flex', gap:32 }}>
              {[{ v:posts.length, l:'Articles' }, { v:formatNumber(totalViews), l:'Total views' }].map(s => (
                <div key={s.l}>
                  <div style={{ fontSize:22, fontWeight:600, letterSpacing:'-.02em', color:'var(--text-1)' }}>{s.v}</div>
                  <div style={{ fontSize:12, color:'var(--text-3)', marginTop:2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.09em',
          color:'var(--text-4)', marginBottom:26 }}>All articles</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))', gap:20 }}>
          {posts.map((post,i) => (
            <div key={post.id} style={{ animation:`fadeUp .4s var(--ease) ${i*.07}s both` }}>
              <PostCard post={post} />
            </div>
          ))}
        </div>
      </main>
      <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }`}</style>
    </>
  )
}
