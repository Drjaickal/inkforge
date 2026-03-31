'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MOCK_POSTS, formatRelativeDate, formatNumber } from '@/lib/data'
import { Badge, Button, Input } from '@/components/ui'
import type { Post, PostStatus } from '@/types'

const FILTERS: Array<{label:string;value:PostStatus|'ALL'}> = [
  {label:'All',value:'ALL'},{label:'Published',value:'PUBLISHED'},
  {label:'Draft',value:'DRAFT'},{label:'Scheduled',value:'SCHEDULED'},{label:'Archived',value:'ARCHIVED'},
]

export default function PostsListPage() {
  const [status, setStatus] = useState<PostStatus|'ALL'>('ALL')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = useMemo(() =>
    MOCK_POSTS.filter(p => {
      if (status !== 'ALL' && p.status !== status) return false
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    }), [status, search])

  const allSel = filtered.length > 0 && filtered.every(p => selected.has(p.id))
  const toggle = (id: string) => { const s = new Set(selected); s.has(id)?s.delete(id):s.add(id); setSelected(s) }

  return (
    <div style={{ maxWidth:1060 }}>
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:26, fontWeight:500,
            letterSpacing:'-.02em', marginBottom:3 }}>Posts</h1>
          <p style={{ fontSize:12, color:'var(--text-4)' }}>{MOCK_POSTS.length} total articles</p>
        </div>
        <Link href="/admin/posts/new">
          <Button variant="gold" size="sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New post
          </Button>
        </Link>
      </div>

      {/* Toolbar */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18, flexWrap:'wrap' }}>
        <div style={{ display:'flex', background:'var(--bg-2)', border:'1px solid var(--border)',
          borderRadius:'var(--r-md)', padding:3, gap:2 }}>
          {FILTERS.map(f => (
            <button key={f.value} onClick={() => setStatus(f.value)} style={{
              padding:'5px 13px', borderRadius:'var(--r-sm)', fontSize:12, cursor:'pointer',
              background: status===f.value ? 'var(--bg-4)' : 'transparent',
              color: status===f.value ? 'var(--text-1)' : 'var(--text-3)',
              border: status===f.value ? '1px solid var(--border-md)' : '1px solid transparent',
              fontWeight: status===f.value ? 500 : 400,
              transition:`all var(--t-fast)`,
            }}>{f.label}</button>
          ))}
        </div>
        <div style={{ flex:1, maxWidth:300 }}>
          <Input placeholder="Search posts…" value={search} onChange={e => setSearch(e.target.value)}
            icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>} />
        </div>
        {selected.size > 0 && (
          <div style={{ display:'flex', gap:8, marginLeft:'auto', alignItems:'center' }}>
            <span style={{ fontSize:12, color:'var(--text-3)' }}>{selected.size} selected</span>
            <Button size="xs" variant="outline">Publish</Button>
            <Button size="xs" variant="outline">Archive</Button>
            <Button size="xs" variant="danger">Delete</Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div style={{ background:'var(--bg-1)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border)', background:'var(--bg-2)' }}>
              <th style={{ width:36, padding:'10px 14px' }}>
                <Check checked={allSel} onChange={() => allSel ? setSelected(new Set()) : setSelected(new Set(filtered.map(p=>p.id)))} />
              </th>
              {['Post','Status','Category','Views','Words','Updated',''].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'10px 16px', fontSize:10,
                  fontWeight:600, color:'var(--text-4)', textTransform:'uppercase',
                  letterSpacing:'.08em', whiteSpace:'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding:'52px 22px', textAlign:'center', color:'var(--text-4)', fontSize:13 }}>
                No posts found.{' '}
                <Link href="/admin/posts/new" style={{ color:'var(--gold)', textDecoration:'none' }}>Create one →</Link>
              </td></tr>
            )}
            {filtered.map(post => <PostRow key={post.id} post={post} sel={selected.has(post.id)} onToggle={() => toggle(post.id)} />)}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16 }}>
        <span style={{ fontSize:12, color:'var(--text-4)' }}>Showing {filtered.length} of {MOCK_POSTS.length}</span>
        <div style={{ display:'flex', gap:6 }}>
          <Button size="xs" variant="outline" disabled>← Prev</Button>
          <Button size="xs" variant="outline" disabled>Next →</Button>
        </div>
      </div>
    </div>
  )
}

function PostRow({ post, sel, onToggle }: { post:Post; sel:boolean; onToggle:()=>void }) {
  const [hov, setHov] = useState(false)
  const map = { PUBLISHED:'published', DRAFT:'draft', SCHEDULED:'scheduled', ARCHIVED:'archived' } as const
  return (
    <tr style={{ borderBottom:'1px solid var(--border)',
      background: sel ? 'rgba(201,169,110,.04)' : hov ? 'var(--bg-2)' : 'transparent',
      transition:`background var(--t-fast)` }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <td style={{ padding:'12px 14px' }}><Check checked={sel} onChange={onToggle} /></td>
      <td style={{ padding:'12px 16px', maxWidth:300 }}>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          {post.banner && (
            <img src={post.banner.url} alt="" style={{ width:46, height:34, objectFit:'cover',
              borderRadius:'var(--r-sm)', flexShrink:0, border:'1px solid var(--border)' }} />
          )}
          <div>
            <Link href={`/admin/posts/${post.id}`} style={{ fontSize:13, fontWeight:500, color:'var(--text-1)',
              display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
              maxWidth:240, textDecoration:'none' }}>
              {post.title}
            </Link>
            <span style={{ fontSize:11, color:'var(--text-4)' }}>{post.author.name}</span>
          </div>
        </div>
      </td>
      <td style={{ padding:'12px 16px' }}><Badge variant={map[post.status]}>{post.status.charAt(0)+post.status.slice(1).toLowerCase()}</Badge></td>
      <td style={{ padding:'12px 16px' }}>
        <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
          {post.categories.slice(0,2).map(c => (
            <span key={c.id} style={{ fontSize:10, color:'var(--gold)', background:'var(--gold-dim)',
              padding:'2px 8px', borderRadius:99 }}>{c.name}</span>
          ))}
        </div>
      </td>
      <td style={{ padding:'12px 16px', fontSize:12, color:'var(--text-3)', whiteSpace:'nowrap' }}>
        {post.views ? formatNumber(post.views) : '—'}
      </td>
      <td style={{ padding:'12px 16px', fontSize:12, color:'var(--text-3)' }}>
        {post.wordCount ? post.wordCount.toLocaleString() : '—'}
      </td>
      <td style={{ padding:'12px 16px', fontSize:11, color:'var(--text-4)', whiteSpace:'nowrap' }}>
        {formatRelativeDate(post.updatedAt)}
      </td>
      <td style={{ padding:'12px 16px' }}>
        <div style={{ display:'flex', gap:5 }}>
          <Link href={`/admin/posts/${post.id}`}>
            <button style={{ padding:'4px 10px', borderRadius:'var(--r-sm)', fontSize:11,
              color:'var(--text-2)', border:'1px solid var(--border)', background:'transparent',
              cursor:'pointer', transition:`all var(--t-fast)` }}>Edit</button>
          </Link>
          {post.status === 'PUBLISHED' && (
            <Link href={`/blog/${post.slug}`} target="_blank">
              <button style={{ padding:'4px 8px', borderRadius:'var(--r-sm)', fontSize:11,
                color:'var(--text-4)', border:'1px solid transparent', background:'transparent',
                cursor:'pointer' }}>↗</button>
            </Link>
          )}
        </div>
      </td>
    </tr>
  )
}

function Check({ checked, onChange }: { checked:boolean; onChange:()=>void }) {
  return (
    <button onClick={onChange} style={{ width:16, height:16, borderRadius:4, flexShrink:0,
      border:`1.5px solid ${checked ? 'var(--gold)' : 'var(--border-md)'}`,
      background: checked ? 'var(--gold-dim)' : 'transparent',
      display:'flex', alignItems:'center', justifyContent:'center',
      cursor:'pointer', transition:`all var(--t-fast)` }}>
      {checked && <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="var(--gold)" strokeWidth={2.5} strokeLinecap="round"><polyline points="2,6 5,9 10,3"/></svg>}
    </button>
  )
}
