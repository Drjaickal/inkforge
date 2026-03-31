'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { searchApi } from '@/lib/api'
import type { ApiPost } from '@/lib/api'
import { Spinner } from '@/components/ui'

function formatDate(str: string) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
    }).format(new Date(str))
}

function SearchContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initial = searchParams.get('q') || ''

    const [query, setQuery] = useState(initial)
    const [results, setResults] = useState<ApiPost[]>([])
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const doSearch = useCallback(async (q: string) => {
        if (!q.trim()) { setResults([]); setSearched(false); return }
        setLoading(true)
        setSearched(true)
        try {
            const data = await searchApi.search(q)
            setResults(data)
        } catch {
            setResults([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (initial) doSearch(initial)
    }, [initial])

    useEffect(() => {
        const t = setTimeout(() => {
            if (query !== initial) {
                router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false })
                doSearch(query)
            }
        }, 400)
        return () => clearTimeout(t)
    }, [query])

    return (
        <main style={{ maxWidth: 'var(--wide)', margin: '0 auto', padding: '56px 28px 96px' }}>

            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <h1 style={{
                    fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 500,
                    letterSpacing: '-.02em', marginBottom: 24, color: 'var(--text-1)'
                }}>
                    Search articles
                </h1>

                {/* Search input */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'var(--bg-1)', border: '1px solid var(--border-md)',
                    borderRadius: 'var(--r-lg)', padding: '12px 18px', maxWidth: 600
                }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-3)" strokeWidth={2} strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        autoFocus
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search posts, topics, authors…"
                        style={{
                            flex: 1, fontSize: 15, background: 'transparent',
                            border: 'none', outline: 'none', color: 'var(--text-1)'
                        }}
                    />
                    {query && (
                        <button
                            onClick={() => { setQuery(''); setResults([]); setSearched(false) }}
                            style={{
                                color: 'var(--text-4)', background: 'none',
                                border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-3)', fontSize: 14 }}>
                    <Spinner size={16} />
                    Searching…
                </div>
            )}

            {/* No results */}
            {!loading && searched && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <p style={{ fontSize: 18, color: 'var(--text-3)', marginBottom: 12 }}>
                        No results for "
                        <strong style={{ color: 'var(--text-1)' }}>{query}</strong>
                        "
                    </p>
                    <p style={{ fontSize: 14, color: 'var(--text-4)', marginBottom: 20 }}>
                        Try different keywords or browse by topic.
                    </p>
                    <Link href="/blog" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 500 }}>
                        Browse all articles →
                    </Link>
                </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <div>
                    <p style={{ fontSize: 12, color: 'var(--text-4)', marginBottom: 20 }}>
                        {results.length} result{results.length !== 1 ? 's' : ''} for "
                        <strong style={{ color: 'var(--text-2)' }}>{query}</strong>"
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {results.map(post => {
                            const c = (post.content || {}) as any
                            return (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    style={{ display: 'block', textDecoration: 'none' }}
                                >
                                    <div style={{
                                        background: 'var(--bg-1)', border: '1px solid var(--border)',
                                        borderRadius: 'var(--r-lg)', padding: '20px 24px',
                                        transition: 'border-color var(--t-fast)',
                                        display: 'flex', alignItems: 'flex-start',
                                        justifyContent: 'space-between', gap: 16
                                    }}
                                        className="search-result"
                                    >
                                        <div style={{ flex: 1 }}>
                                            <h2 style={{
                                                fontFamily: 'var(--font-serif)', fontSize: 18,
                                                fontWeight: 500, color: 'var(--text-1)',
                                                marginBottom: 8, lineHeight: 1.35
                                            }}>
                                                {post.title}
                                            </h2>
                                            {c.excerpt && (
                                                <p style={{
                                                    fontSize: 13, color: 'var(--text-3)', lineHeight: 1.6,
                                                    display: '-webkit-box', WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                                                    marginBottom: 12
                                                }}>
                                                    {c.excerpt}
                                                </p>
                                            )}
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                                                    {post.author.name || post.author.email.split('@')[0]}
                                                </span>
                                                {post.publishedAt && (
                                                    <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                                                        · {formatDate(post.publishedAt)}
                                                    </span>
                                                )}
                                                {c.readingTime && (
                                                    <span style={{ fontSize: 11, color: 'var(--text-4)' }}>
                                                        · {c.readingTime} min read
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {c.banner?.url && (
                                            <img
                                                src={c.banner.url}
                                                alt=""
                                                style={{
                                                    width: 80, height: 60, objectFit: 'cover',
                                                    borderRadius: 'var(--r-md)', flexShrink: 0
                                                }}
                                            />
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Empty state */}
            {!searched && !loading && (
                <p style={{ fontSize: 14, color: 'var(--text-4)' }}>
                    Start typing to search across all published articles.
                </p>
            )}

            <style>{`
        .search-result:hover { border-color: var(--gold-border) !important; }
      `}</style>
        </main>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <main style={{ maxWidth: 'var(--wide)', margin: '0 auto', padding: '56px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-3)', fontSize: 14 }}>
                    <Spinner size={18} />
                    Loading search…
                </div>
            </main>
        }>
            <SearchContent />
        </Suspense>
    )
}