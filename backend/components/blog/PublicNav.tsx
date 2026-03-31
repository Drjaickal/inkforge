'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOCK_CATEGORIES } from '@/lib/data'

export function PublicNav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); setSearchOpen(v=>!v) }
      if (e.key==='Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  const links = [
    { href:'/blog', label:'All posts' },
    { href:'/blog/category/technology', label:'Technology' },
    { href:'/blog/category/engineering', label:'Engineering' },
    { href:'/blog/category/design', label:'Design' },
  ]

  const isActive = (href: string) =>
    href === '/blog' ? pathname === '/blog' : pathname.startsWith(href)

  return (
    <>
      <header style={{
        position:'sticky', top:0, zIndex:40, height:'var(--nav-h)',
        background: scrolled ? 'rgba(10,10,11,.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
        transition:`background var(--t-slow), border-color var(--t-slow), backdrop-filter var(--t-slow)`,
        display:'flex', alignItems:'center',
      }}>
        <div style={{ maxWidth:'var(--wide)', margin:'0 auto', width:'100%', padding:'0 28px',
          display:'flex', alignItems:'center', gap:0 }}>

          {/* Wordmark */}
          <Link href="/blog" style={{ display:'flex', alignItems:'center', gap:10, flexShrink:0, marginRight:40 }}>
            <div style={{ width:30, height:30, borderRadius:8, background:'var(--gold-dim)',
              border:'1px solid var(--gold-border)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 2h4v10H2zM8 2h4v4H8zM8 8h4v4H8z" fill="var(--gold)"/>
              </svg>
            </div>
            <span style={{ fontFamily:'var(--font-serif)', fontSize:17, color:'var(--text-1)', letterSpacing:'-.01em' }}>
              The Corporate Blog
            </span>
          </Link>

          {/* Nav links */}
          <nav style={{ display:'flex', gap:2, flex:1 }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding:'6px 13px', borderRadius:'var(--r-md)', fontSize:13,
                color: isActive(l.href) ? 'var(--text-1)' : 'var(--text-2)',
                background: isActive(l.href) ? 'var(--bg-3)' : 'transparent',
                transition:`all var(--t-fast)`, fontWeight: isActive(l.href) ? 500 : 400,
              }}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={() => setSearchOpen(true)} style={{
              display:'flex', alignItems:'center', gap:8, height:34, padding:'0 14px',
              borderRadius:'var(--r-md)', border:'1px solid var(--border)',
              background:'var(--bg-2)', color:'var(--text-3)', fontSize:12,
              cursor:'pointer', transition:`all var(--t-fast)`,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span>Search</span>
              <kbd style={{ fontSize:10, color:'var(--text-4)', background:'var(--bg-3)', padding:'1px 5px', borderRadius:4 }}>⌘K</kbd>
            </button>
            <Link href="/admin/dashboard" style={{
              height:34, padding:'0 16px', borderRadius:'var(--r-md)',
              background:'var(--gold-dim)', border:'1px solid var(--gold-border)',
              color:'var(--gold)', fontSize:12, fontWeight:500,
              display:'flex', alignItems:'center', transition:`all var(--t-fast)`,
            }}>
              Admin →
            </Link>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:60, background:'rgba(0,0,0,.8)',
          backdropFilter:'blur(8px)', display:'flex', alignItems:'flex-start',
          justifyContent:'center', padding:'80px 24px 24px' }}
          onClick={() => setSearchOpen(false)}>
          <div style={{ width:'100%', maxWidth:580, background:'var(--bg-2)',
            border:'1px solid var(--border-md)', borderRadius:'var(--r-xl)', overflow:'hidden',
            boxShadow:'0 25px 60px rgba(0,0,0,.6)' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 18px',
              borderBottom:'1px solid var(--border)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-3)" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search articles…"
                style={{ flex:1, fontSize:15, background:'transparent', border:'none', outline:'none', color:'var(--text-1)' }} />
              <button onClick={() => setSearchOpen(false)}
                style={{ fontSize:11, color:'var(--text-3)', background:'var(--bg-3)',
                  padding:'3px 8px', borderRadius:'var(--r-sm)', border:'1px solid var(--border)', cursor:'pointer' }}>
                ESC
              </button>
            </div>
            <div style={{ padding:'8px 8px 8px' }}>
              {!query && (
                <>
                  <p style={{ fontSize:11, color:'var(--text-4)', padding:'8px 12px 4px',
                    textTransform:'uppercase', letterSpacing:'.08em' }}>Browse topics</p>
                  {MOCK_CATEGORIES.map(cat => (
                    <Link key={cat.id} href={`/blog/category/${cat.slug}`}
                      onClick={() => setSearchOpen(false)}
                      style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                        padding:'10px 14px', borderRadius:'var(--r-md)', fontSize:14,
                        color:'var(--text-2)', transition:`background var(--t-fast)` }}>
                      <span>{cat.name}</span>
                      <span style={{ fontSize:12, color:'var(--text-4)' }}>{cat.postCount} posts</span>
                    </Link>
                  ))}
                </>
              )}
              {query && (
                <div style={{ padding:'12px 14px', fontSize:14, color:'var(--text-2)' }}>
                  Searching for "<strong style={{ color:'var(--text-1)' }}>{query}</strong>"…
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
