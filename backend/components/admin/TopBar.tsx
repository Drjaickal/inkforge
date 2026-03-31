'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LABELS: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/posts':     'All posts',
  '/admin/posts/new': 'New post',
  '/admin/media':     'Media library',
  '/admin/categories':'Categories',
  '/admin/authors':   'Authors',
  '/admin/settings':  'Settings',
}

export function AdminTopBar() {
  const pathname = usePathname()
  const isEditor = /^\/admin\/posts\/.+/.test(pathname) && pathname !== '/admin/posts'
  const label = LABELS[pathname] ?? (isEditor ? 'Edit post' : 'Dashboard')

  return (
    <header style={{ height:52, borderBottom:'1px solid var(--border)',
      background:'var(--bg-1)', display:'flex', alignItems:'center',
      justifyContent:'space-between', padding:'0 32px', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <Link href="/admin/dashboard" style={{ fontSize:12, color:'var(--text-4)', textDecoration:'none' }}>Admin</Link>
        {pathname !== '/admin/dashboard' && <>
          <span style={{ color:'var(--text-4)', fontSize:12 }}>/</span>
          <span style={{ fontSize:12, color:'var(--text-2)' }}>{label}</span>
        </>}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <Link href="/blog" target="_blank" style={{
          display:'flex', alignItems:'center', gap:6, height:30, padding:'0 12px',
          borderRadius:'var(--r-md)', border:'1px solid var(--border)',
          background:'var(--bg-2)', color:'var(--text-3)', fontSize:11, textDecoration:'none',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View blog
        </Link>
        {!isEditor && (
          <Link href="/admin/posts/new" style={{
            display:'flex', alignItems:'center', gap:5, height:30, padding:'0 14px',
            borderRadius:'var(--r-md)', background:'var(--gold)', color:'#0A0A0B',
            fontSize:11, fontWeight:600, textDecoration:'none',
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New post
          </Link>
        )}
      </div>
    </header>
  )
}
