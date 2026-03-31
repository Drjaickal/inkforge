import { PublicNav } from '@/components/blog/PublicNav'
import Link from 'next/link'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <PublicNav />
      <div style={{ flex:1 }}>{children}</div>
      <Footer />
    </div>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ borderTop:'1px solid var(--border)', background:'var(--bg-1)', padding:'56px 28px 36px', marginTop:'auto' }}>
      <div style={{ maxWidth:'var(--wide)', margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr', gap:48, marginBottom:52 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:28, height:28, borderRadius:7, background:'var(--gold-dim)',
                border:'1px solid var(--gold-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2h4v10H2zM8 2h4v4H8zM8 8h4v4H8z" fill="var(--gold)"/>
                </svg>
              </div>
              <span style={{ fontFamily:'var(--font-serif)', fontSize:15, color:'var(--text-1)' }}>The Corporate Blog</span>
            </div>
            <p style={{ fontSize:13, color:'var(--text-3)', lineHeight:1.75, maxWidth:220 }}>
              In-depth writing on technology, engineering, design, and business strategy.
            </p>
          </div>
          {[
            { label:'Content', links:[
              { href:'/blog', label:'All posts' },
              { href:'/blog/category/technology', label:'Technology' },
              { href:'/blog/category/engineering', label:'Engineering' },
              { href:'/blog/category/design', label:'Design' },
            ]},
            { label:'Authors', links:[
              { href:'/blog/author/alexandra-chen', label:'Alexandra Chen' },
              { href:'/blog', label:'All authors' },
            ]},
            { label:'Platform', links:[
              { href:'/admin/dashboard', label:'Dashboard' },
              { href:'/admin/posts/new', label:'New post' },
              { href:'/login', label:'Sign in' },
              { href:'/register', label:'Request access' },
            ]},
          ].map(col => (
            <div key={col.label}>
              <p style={{ fontSize:11, fontWeight:600, textTransform:'uppercase', letterSpacing:'.09em',
                color:'var(--text-4)', marginBottom:18 }}>{col.label}</p>
              <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                {col.links.map(l => (
                  <Link key={l.href} href={l.href} style={{ fontSize:13, color:'var(--text-3)',
                    transition:`color var(--t-fast)` }}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid var(--border)', paddingTop:24,
          display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <p style={{ fontSize:12, color:'var(--text-4)' }}>© {year} The Corporate Blog. All rights reserved.</p>
          <p style={{ fontSize:12, color:'var(--text-4)' }}>Built with Next.js · Deployed on Vercel</p>
        </div>
      </div>
    </footer>
  )
}
