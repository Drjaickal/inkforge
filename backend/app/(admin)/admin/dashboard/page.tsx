'use client'
import Link from 'next/link'
import { MOCK_STATS, MOCK_POSTS, formatNumber, formatRelativeDate } from '@/lib/data'
import { Badge } from '@/components/ui'
import type { Post } from '@/types'

export default function DashboardPage() {
  const stats = MOCK_STATS

  return (
    <div style={{ maxWidth:1060 }}>
      {/* Header */}
      <div style={{ marginBottom:36 }}>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:28, fontWeight:500,
          letterSpacing:'-.02em', marginBottom:4, color:'var(--text-1)' }}>
          Good morning, Alexandra.
        </h1>
        <p style={{ fontSize:13, color:'var(--text-3)' }}>Here is what is happening with your blog today.</p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:32 }}>
        {[
          { label:'Total posts',    value:stats.totalPosts,              sub:`${stats.publishedPosts} published`, accent:false },
          { label:'Drafts',         value:stats.draftPosts,              sub:'awaiting review',   accent:true, color:'var(--amber)' },
          { label:'All-time views', value:formatNumber(stats.totalViews),sub:'across all posts',  accent:false },
          { label:'This month',     value:formatNumber(stats.monthlyViews),sub:'page views',      accent:true, color:'var(--green)' },
        ].map(c => (
          <div key={c.label} style={{ background:'var(--bg-1)', border:'1px solid var(--border)',
            borderRadius:'var(--r-lg)', padding:'20px 22px',
            borderTop:`2px solid ${c.accent ? c.color : 'var(--border)'}` }}>
            <p style={{ fontSize:11, color:'var(--text-4)', textTransform:'uppercase',
              letterSpacing:'.08em', fontWeight:500, marginBottom:10 }}>{c.label}</p>
            <p style={{ fontSize:26, fontWeight:600, letterSpacing:'-.03em', marginBottom:3,
              color: c.accent ? c.color : 'var(--text-1)' }}>{c.value}</p>
            <p style={{ fontSize:11, color:'var(--text-4)' }}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:22 }}>

        {/* Posts table */}
        <div style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'16px 22px', borderBottom:'1px solid var(--border)' }}>
            <h2 style={{ fontSize:13, fontWeight:600, color:'var(--text-1)' }}>Recent posts</h2>
            <Link href="/admin/posts" style={{ fontSize:11, color:'var(--gold)', fontWeight:500, textDecoration:'none' }}>View all →</Link>
          </div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['Post','Status','Views','Updated'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'9px 22px', fontSize:10,
                    fontWeight:600, color:'var(--text-4)', textTransform:'uppercase', letterSpacing:'.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_POSTS.map(post => (
                <tr key={post.id} className="dash-row">
                  <td style={{ padding:'13px 22px', maxWidth:280 }}>
                    <Link href={`/admin/posts/${post.id}`} style={{ fontSize:13, fontWeight:500,
                      color:'var(--text-1)', display:'block', overflow:'hidden',
                      textOverflow:'ellipsis', whiteSpace:'nowrap', textDecoration:'none' }}>
                      {post.title}
                    </Link>
                    <span style={{ fontSize:11, color:'var(--text-4)' }}>
                      {post.categories.map(c => c.name).join(', ')}
                    </span>
                  </td>
                  <td style={{ padding:'13px 22px' }}>
                    <StatusBadge status={post.status} />
                  </td>
                  <td style={{ padding:'13px 22px', fontSize:12, color:'var(--text-3)' }}>
                    {post.views ? formatNumber(post.views) : '—'}
                  </td>
                  <td style={{ padding:'13px 22px', fontSize:11, color:'var(--text-4)', whiteSpace:'nowrap' }}>
                    {formatRelativeDate(post.updatedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right col */}
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>

          {/* Quick actions */}
          <div style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'16px 18px' }}>
            <h2 style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em',
              color:'var(--text-4)', marginBottom:14 }}>Quick actions</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { href:'/admin/posts/new',          label:'Write new post',      gold:true },
                { href:'/admin/posts?filter=draft', label:'Review drafts' },
                { href:'/admin/media',              label:'Upload media' },
                { href:'/admin/categories',         label:'Manage categories' },
              ].map(a => (
                <Link key={a.href} href={a.href} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'9px 13px', borderRadius:'var(--r-md)', fontSize:12, textDecoration:'none',
                  border:`1px solid ${a.gold ? 'var(--gold-border)' : 'var(--border)'}`,
                  background: a.gold ? 'var(--gold-dim)' : 'var(--bg-2)',
                  color: a.gold ? 'var(--gold)' : 'var(--text-2)',
                  fontWeight: a.gold ? 500 : 400,
                  transition:`all var(--t-fast)`,
                }}>
                  {a.label} <span style={{ opacity:.5 }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Top posts */}
          <div style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'16px 18px' }}>
            <h2 style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em',
              color:'var(--text-4)', marginBottom:14 }}>Top performers</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {stats.topPosts.map((post, i) => (
                <div key={post.id} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <span style={{ width:20, height:20, borderRadius:6, flexShrink:0,
                    background: i===0 ? 'var(--gold-dim)' : 'var(--bg-3)',
                    color: i===0 ? 'var(--gold)' : 'var(--text-4)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:10, fontWeight:700 }}>{i+1}</span>
                  <div>
                    <Link href={`/admin/posts/${post.id}`} style={{ fontSize:12, fontWeight:500,
                      color:'var(--text-1)', lineHeight:1.4, display:'block', textDecoration:'none' }}>
                      {post.title.length > 52 ? post.title.slice(0,52)+'…' : post.title}
                    </Link>
                    <span style={{ fontSize:11, color:'var(--text-4)' }}>
                      {post.views ? formatNumber(post.views) : '0'} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO health */}
          <div style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:'16px 18px' }}>
            <h2 style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.08em',
              color:'var(--text-4)', marginBottom:14 }}>SEO health</h2>
            {[
              { label:'Sitemap up to date', ok:true },
              { label:'All pages have meta', ok:true },
              { label:'Lighthouse ≥ 90',    ok:true },
              { label:'Canonical tags set', ok:true },
              { label:'2 posts missing excerpts', ok:false },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', gap:9, alignItems:'center',
                padding:'6px 0', borderBottom:'1px solid var(--border)', fontSize:12 }}>
                <span style={{ fontSize:13, color:item.ok ? 'var(--green)' : 'var(--amber)',
                  fontWeight:600, flexShrink:0 }}>{item.ok ? '✓' : '!'}</span>
                <span style={{ color:item.ok ? 'var(--text-2)' : 'var(--text-1)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dash-row { border-bottom:1px solid var(--border); transition:background var(--t-fast); }
        .dash-row:hover { background:var(--bg-2); }
      `}</style>
    </div>
  )
}

function StatusBadge({ status }: { status: Post['status'] }) {
  const map = { PUBLISHED:'published', DRAFT:'draft', SCHEDULED:'scheduled', ARCHIVED:'archived' } as const
  return <Badge variant={map[status]}>{status.charAt(0)+status.slice(1).toLowerCase()}</Badge>
}
