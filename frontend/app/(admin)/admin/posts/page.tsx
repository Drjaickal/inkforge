'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_POSTS, formatRelativeDate, formatNumber } from '@/lib/data'
import { Badge, Button, Input } from '@/components/ui'
import type { Post, PostStatus } from '@/types'

const STATUS_FILTERS: Array<{ label: string; value: PostStatus | 'ALL' }> = [
  { label: 'All', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

export default function PostsListPage() {
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() => {
    return MOCK_POSTS.filter(p => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [statusFilter, search])

  const allSelected = filtered.length > 0 && filtered.every(p => selected.has(p.id))

  function toggleAll() {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(filtered.map(p => p.id)))
  }

  function toggleOne(id: string) {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em', marginBottom: 2 }}>Posts</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{MOCK_POSTS.length} total posts</p>
        </div>
        <Link href="/admin/posts/new">
          <Button variant="primary">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New post
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
          {STATUS_FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              style={{
                padding: '5px 14px', borderRadius: 7, fontSize: 13, cursor: 'pointer',
                background: statusFilter === f.value ? 'var(--bg-overlay)' : 'transparent',
                color: statusFilter === f.value ? 'var(--text-primary)' : 'var(--text-muted)',
                border: statusFilter === f.value ? '1px solid var(--border-light)' : '1px solid transparent',
                transition: 'all 150ms',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, maxWidth: 320 }}>
          <Input
            placeholder="Search posts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<SearchIcon />}
          />
        </div>

        {selected.size > 0 && (
          <div style={{ display: 'flex', gap: 8, marginLeft: 'auto', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{selected.size} selected</span>
            <Button size="sm" variant="ghost">Publish</Button>
            <Button size="sm" variant="ghost">Archive</Button>
            <Button size="sm" variant="danger">Delete</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              <th style={{ width: 40, padding: '11px 16px' }}>
                <Checkbox checked={allSelected} onChange={toggleAll} />
              </th>
              {['Post', 'Status', 'Category', 'Views', 'Words', 'Updated', ''].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '11px 16px', fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '48px 22px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                  No posts found.{' '}
                  <Link href="/admin/posts/new" style={{ color: 'var(--accent)' }}>Create one →</Link>
                </td>
              </tr>
            )}
            {filtered.map(post => (
              <PostRow
                key={post.id}
                post={post}
                selected={selected.has(post.id)}
                onToggle={() => toggleOne(post.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination stub */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Showing {filtered.length} of {MOCK_POSTS.length} posts
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button size="sm" variant="outline" disabled>← Prev</Button>
          <Button size="sm" variant="outline" disabled>Next →</Button>
        </div>
      </div>
    </div>
  )
}

function PostRow({ post, selected, onToggle }: { post: Post; selected: boolean; onToggle: () => void }) {
  const statusMap = { PUBLISHED: 'published', DRAFT: 'draft', SCHEDULED: 'scheduled', ARCHIVED: 'archived' } as const

  return (
    <tr
      style={{
        borderBottom: '1px solid var(--border)',
        background: selected ? 'rgba(200,184,154,0.04)' : 'transparent',
        transition: 'background 150ms',
      }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLTableRowElement).style.background = 'var(--bg-elevated)' }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLTableRowElement).style.background = 'transparent' }}
    >
      <td style={{ padding: '13px 16px' }}>
        <Checkbox checked={selected} onChange={onToggle} />
      </td>
      <td style={{ padding: '13px 16px', maxWidth: 360 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {post.banner && (
            <img
              src={post.banner.url}
              alt=""
              style={{ width: 48, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0, border: '1px solid var(--border)' }}
            />
          )}
          <div>
            <Link
              href={`/admin/posts/${post.id}`}
              style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}
            >
              {post.title}
            </Link>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{post.author.name}</span>
          </div>
        </div>
      </td>
      <td style={{ padding: '13px 16px' }}>
        <Badge variant={statusMap[post.status]}>
          {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
        </Badge>
      </td>
      <td style={{ padding: '13px 16px' }}>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {post.categories.slice(0, 2).map(c => (
            <span key={c.id} style={{ fontSize: 11, color: 'var(--accent)', background: 'rgba(200,184,154,0.08)', padding: '2px 7px', borderRadius: 4 }}>
              {c.name}
            </span>
          ))}
        </div>
      </td>
      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {post.views ? formatNumber(post.views) : '—'}
      </td>
      <td style={{ padding: '13px 16px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
        {post.wordCount ? post.wordCount.toLocaleString() : '—'}
      </td>
      <td style={{ padding: '13px 16px', fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
        {formatRelativeDate(post.updatedAt)}
      </td>
      <td style={{ padding: '13px 16px' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <Link href={`/admin/posts/${post.id}`}>
            <button style={{ padding: '5px 10px', borderRadius: 6, fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)', background: 'transparent', cursor: 'pointer', transition: 'all 150ms' }}>
              Edit
            </button>
          </Link>
          {post.status === 'PUBLISHED' && (
            <Link href={`/blog/${post.slug}`} target="_blank">
              <button style={{ padding: '5px 10px', borderRadius: 6, fontSize: 12, color: 'var(--text-muted)', border: '1px solid transparent', background: 'transparent', cursor: 'pointer', transition: 'all 150ms' }}>
                ↗
              </button>
            </Link>
          )}
        </div>
      </td>
    </tr>
  )
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      style={{
        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
        border: `1.5px solid ${checked ? 'var(--accent)' : 'var(--border-light)'}`,
        background: checked ? 'rgba(200,184,154,0.15)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 150ms',
      }}
    >
      {checked && <svg width={10} height={10} viewBox="0 0 12 12" fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
    </button>
  )
}

function SearchIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
}
