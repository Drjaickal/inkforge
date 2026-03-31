'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CRUMB_MAP: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/posts': 'All Posts',
  '/admin/posts/new': 'New Post',
  '/admin/media': 'Media Library',
  '/admin/categories': 'Categories',
  '/admin/authors': 'Authors',
  '/admin/settings': 'Settings',
}

export function AdminTopBar() {
  const pathname = usePathname()
  const isEditor = pathname.includes('/admin/posts/') && pathname !== '/admin/posts'

  return (
    <header style={{
      height: 56,
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 36px',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link href="/admin/dashboard" style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 150ms' }}>
          Admin
        </Link>
        {pathname !== '/admin/dashboard' && (
          <>
            <span style={{ color: 'var(--border-light)', fontSize: 13 }}>/</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {CRUMB_MAP[pathname] ?? 'Edit Post'}
            </span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <Link
          href="/blog"
          target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, color: 'var(--text-muted)',
            padding: '6px 12px', borderRadius: 8,
            border: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
            transition: 'all 150ms',
          }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          View blog
        </Link>
        {!isEditor && (
          <Link
            href="/admin/posts/new"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 13, color: '#0C0C0E', fontWeight: 500,
              padding: '6px 14px', borderRadius: 8,
              background: 'var(--accent)',
              transition: 'opacity 150ms',
            }}
          >
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New post
          </Link>
        )}
      </div>
    </header>
  )
}
