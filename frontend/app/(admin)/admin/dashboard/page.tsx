'use client'

import Link from 'next/link'
import { MOCK_STATS, MOCK_POSTS, formatNumber, formatRelativeDate } from '@/lib/data'
import { Badge } from '@/components/ui'
import type { Post } from '@/types'

export default function DashboardPage() {
  const stats = MOCK_STATS
  const recent = MOCK_POSTS.slice(0, 5)

  return (
    <div style={{ maxWidth: 1100 }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Good morning, Alexandra.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Here is what is happening with your blog today.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
        {[
          { label: 'Total posts', value: stats.totalPosts, sub: `${stats.publishedPosts} published`, color: 'var(--text-primary)' },
          { label: 'Draft posts', value: stats.draftPosts, sub: 'awaiting publish', color: 'var(--amber)' },
          { label: 'Total views', value: formatNumber(stats.totalViews), sub: 'all time', color: 'var(--text-primary)' },
          { label: 'Monthly views', value: formatNumber(stats.monthlyViews), sub: 'this month', color: 'var(--green)' },
        ].map(card => (
          <div key={card.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.label}</p>
            <p style={{ fontSize: 28, fontWeight: 500, color: card.color, letterSpacing: '-0.02em', marginBottom: 4 }}>{card.value}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

        {/* Recent posts table */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 500 }}>Recent posts</h2>
            <Link href="/admin/posts" style={{ fontSize: 13, color: 'var(--accent)' }}>View all →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Title', 'Status', 'Views', 'Updated'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 22px', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map(post => (
                <tr key={post.id} className="dash-row">
                  <td style={{ padding: '14px 22px', maxWidth: 300 }}>
                    <Link href={`/admin/posts/${post.id}`} style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {post.title}
                    </Link>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.categories.map(c => c.name).join(', ')}</span>
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    <StatusBadge status={post.status} />
                  </td>
                  <td style={{ padding: '14px 22px', fontSize: 13, color: 'var(--text-secondary)' }}>{post.views ? formatNumber(post.views) : '—'}</td>
                  <td style={{ padding: '14px 22px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{formatRelativeDate(post.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Quick actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/admin/posts/new', label: 'Write new post', accent: true },
                { href: '/admin/posts?filter=draft', label: 'Review drafts' },
                { href: '/admin/media', label: 'Upload media' },
                { href: '/admin/categories', label: 'Manage categories' },
              ].map(action => (
                <Link key={action.href} href={action.href} className={action.accent ? 'quick-action accent' : 'quick-action'}>
                  {action.label}
                  <span style={{ opacity: 0.5 }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Top performers</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stats.topPosts.map((post, i) => (
                <div key={post.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: i === 0 ? 'rgba(200,184,154,0.15)' : 'var(--bg-overlay)', color: i === 0 ? 'var(--accent)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 500 }}>
                    {i + 1}
                  </span>
                  <div>
                    <Link href={`/admin/posts/${post.id}`} style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.35, display: 'block' }}>
                      {post.title.length > 55 ? post.title.slice(0, 55) + '…' : post.title}
                    </Link>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.views ? formatNumber(post.views) : '0'} views</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 20px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>SEO health</h2>
            {[
              { label: 'Sitemap indexed', ok: true },
              { label: 'All published posts have meta', ok: true },
              { label: 'Lighthouse ≥ 90', ok: true },
              { label: 'Canonical tags set', ok: true },
              { label: '2 drafts missing excerpts', ok: false },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span style={{ color: item.ok ? 'var(--green)' : 'var(--amber)' }}>{item.ok ? '✓' : '!'}</span>
                <span style={{ color: item.ok ? 'var(--text-secondary)' : 'var(--text-primary)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .dash-row { border-bottom: 1px solid var(--border); transition: background 150ms; }
        .dash-row:hover { background: var(--bg-elevated); }
        .quick-action { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-radius: 8px; font-size: 13px; border: 1px solid var(--border); background: var(--bg-elevated); color: var(--text-secondary); text-decoration: none; transition: all 150ms; }
        .quick-action:hover { border-color: var(--border-light); color: var(--text-primary); }
        .quick-action.accent { border-color: rgba(200,184,154,0.25); background: rgba(200,184,154,0.07); color: var(--accent); }
        .quick-action.accent:hover { background: rgba(200,184,154,0.12); }
      `}</style>
    </div>
  )
}

function StatusBadge({ status }: { status: Post['status'] }) {
  const map = { PUBLISHED: 'published', DRAFT: 'draft', SCHEDULED: 'scheduled', ARCHIVED: 'archived' } as const
  return <Badge variant={map[status]}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>
}
