'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MOCK_CATEGORIES } from '@/lib/data'

export function PublicNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  const navLinks = [
    { href: '/blog', label: 'All Posts' },
    { href: '/blog/category/technology', label: 'Technology' },
    { href: '/blog/category/engineering', label: 'Engineering' },
    { href: '/blog/category/design', label: 'Design' },
  ]

  // ⌘K / Ctrl+K opens search, Escape closes it
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [])

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearchOpen(false)
    router.push(`/search?q=${encodeURIComponent(query)}`)
    setQuery('')
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(12,12,14,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        height: 64,
        display: 'flex', alignItems: 'center',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', width: '100%',
          padding: '0 24px', display: 'flex', alignItems: 'center', gap: 32
        }}>
          <Link href="/blog" style={{
            fontFamily: 'var(--font-display)', fontSize: 20,
            letterSpacing: '-0.02em', color: 'var(--accent)', flexShrink: 0
          }}>
            INKFORGE
          </Link>

          <nav style={{ display: 'flex', gap: 4, flex: 1 }} className="hidden-mobile">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  color: pathname === link.href ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: pathname === link.href ? 'var(--bg-overlay)' : 'transparent',
                  transition: 'all 150ms',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 12px', borderRadius: 8,
                border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: 13,
                background: 'var(--bg-elevated)',
                cursor: 'pointer', transition: 'border-color 150ms',
              }}
            >
              <SearchIcon size={14} />
              <span style={{ minWidth: 80 }}>Search...</span>
              <span style={{ fontSize: 11, opacity: 0.5 }}>⌘K</span>
            </button>

            <Link
              href="/admin/dashboard"
              style={{
                padding: '6px 14px', borderRadius: 8,
                border: '1px solid rgba(200,184,154,0.3)',
                color: 'var(--accent)', fontSize: 13,
                background: 'rgba(200,184,154,0.06)',
                transition: 'all 150ms',
              }}
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 60,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', padding: '80px 24px 24px'
          }}
          onClick={() => setSearchOpen(false)}
        >
          <div
            style={{
              width: '100%', maxWidth: 600,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-light)',
              borderRadius: 16, overflow: 'hidden'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search input */}
            <form onSubmit={handleSearchSubmit}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '16px 20px', borderBottom: '1px solid var(--border)'
              }}>
                <SearchIcon size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search articles…"
                  style={{
                    flex: 1, fontSize: 15, background: 'transparent',
                    border: 'none', outline: 'none', color: 'var(--text-primary)'
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  style={{
                    color: 'var(--text-muted)', fontSize: 12,
                    padding: '4px 8px', borderRadius: 6,
                    border: '1px solid var(--border)', cursor: 'pointer',
                    background: 'transparent',
                  }}
                >
                  ESC
                </button>
              </div>
            </form>

            {/* Dropdown results */}
            <div style={{ padding: 16 }}>
              {!query ? (
                <>
                  <p style={{
                    fontSize: 12, color: 'var(--text-muted)', marginBottom: 12,
                    textTransform: 'uppercase', letterSpacing: '0.08em'
                  }}>
                    Browse topics
                  </p>
                  {MOCK_CATEGORIES.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/blog/category/${cat.slug}`}
                      onClick={() => setSearchOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px', borderRadius: 8,
                        color: 'var(--text-secondary)', fontSize: 14,
                        transition: 'all 150ms', textDecoration: 'none',
                      }}
                    >
                      <span>{cat.name}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {cat.postCount} posts
                      </span>
                    </Link>
                  ))}
                </>
              ) : (
                // When user has typed something — show search link
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => { setSearchOpen(false); setQuery('') }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 8,
                    fontSize: 14, color: 'var(--text-secondary)',
                    textDecoration: 'none', background: 'var(--bg-overlay)',
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="var(--accent)" strokeWidth={2} strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Search for "
                  <strong style={{ color: 'var(--text-primary)' }}>{query}</strong>
                  "
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </>
  )
}

function SearchIcon({ size = 16, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" style={style}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}