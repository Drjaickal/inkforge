'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/types'
import { formatDate, formatNumber } from '@/lib/data'
import { Badge } from '@/components/ui'

export function PostCard({ post, variant='default' }: { post:Post; variant?:'default'|'featured'|'compact' }) {
  const [hov, setHov] = useState(false)

  if (variant === 'featured') {
    return (
      <Link href={`/blog/${post.slug}`}
        style={{ display:'block', textDecoration:'none' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <article style={{
          background:'var(--bg-1)', borderRadius:'var(--r-xl)',
          border:`1px solid ${hov ? 'var(--border-hi)' : 'var(--border)'}`,
          overflow:'hidden', transform:hov ? 'translateY(-3px)' : 'translateY(0)',
          transition:`all var(--t-mid) var(--ease)`,
        }}>
          {post.banner && (
            <div style={{ aspectRatio:'21/9', overflow:'hidden', background:'var(--bg-3)' }}>
              <img src={post.banner.url} alt={post.banner.alt} loading="lazy"
                style={{ width:'100%', height:'100%', objectFit:'cover',
                  transform: hov ? 'scale(1.02)' : 'scale(1)', transition:`transform var(--t-slow) var(--ease)` }} />
            </div>
          )}
          <div style={{ padding:'32px 36px 28px' }}>
            <div style={{ display:'flex', gap:6, marginBottom:18, flexWrap:'wrap' }}>
              {post.categories.map(c => <Badge key={c.id} variant="category">{c.name}</Badge>)}
            </div>
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:28, fontWeight:500,
              lineHeight:1.22, letterSpacing:'-.02em', color:'var(--text-1)', marginBottom:14 }}>
              {post.title}
            </h2>
            {post.excerpt && (
              <p style={{ fontSize:15, color:'var(--text-2)', lineHeight:1.7, marginBottom:24,
                display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                {post.excerpt}
              </p>
            )}
            <PostMeta post={post} />
          </div>
        </article>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={`/blog/${post.slug}`} style={{ display:'block', textDecoration:'none' }}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
        <div style={{ display:'flex', gap:14, alignItems:'flex-start',
          padding:'14px 0', borderBottom:'1px solid var(--border)' }}>
          {post.banner && (
            <div style={{ width:68, height:52, borderRadius:'var(--r-md)', overflow:'hidden', flexShrink:0, background:'var(--bg-3)' }}>
              <img src={post.banner.url} alt="" loading="lazy"
                style={{ width:'100%', height:'100%', objectFit:'cover',
                  transform:hov?'scale(1.05)':'scale(1)', transition:`transform var(--t-mid)` }} />
            </div>
          )}
          <div style={{ flex:1, minWidth:0 }}>
            {post.categories[0] && (
              <span style={{ fontSize:10, color:'var(--gold)', textTransform:'uppercase',
                letterSpacing:'.08em', display:'block', marginBottom:5 }}>
                {post.categories[0].name}
              </span>
            )}
            <h3 style={{ fontSize:13, fontWeight:500, lineHeight:1.45, color:hov?'var(--gold-light)':'var(--text-1)',
              marginBottom:6, transition:`color var(--t-fast)`,
              overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
              {post.title}
            </h3>
            <span style={{ fontSize:11, color:'var(--text-3)' }}>
              {post.readingTime} min{post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ''}
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`}
      style={{ display:'flex', flexDirection:'column', textDecoration:'none', height:'100%' }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <article style={{
        flex:1, display:'flex', flexDirection:'column',
        background:'var(--bg-1)', borderRadius:'var(--r-lg)',
        border:`1px solid ${hov ? 'var(--gold-border)' : 'var(--border)'}`,
        overflow:'hidden', transform:hov ? 'translateY(-3px)' : 'translateY(0)',
        transition:`all var(--t-mid) var(--ease)`,
      }}>
        {post.banner && (
          <div style={{ aspectRatio:'16/9', overflow:'hidden', background:'var(--bg-3)' }}>
            <img src={post.banner.url} alt={post.banner.alt} loading="lazy"
              style={{ width:'100%', height:'100%', objectFit:'cover',
                transform:hov?'scale(1.04)':'scale(1)', transition:`transform var(--t-slow)` }} />
          </div>
        )}
        <div style={{ padding:'20px 22px', flex:1, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', gap:5, marginBottom:12, flexWrap:'wrap' }}>
            {post.categories.map(c => <Badge key={c.id} variant="category">{c.name}</Badge>)}
          </div>
          <h2 style={{ fontFamily:'var(--font-serif)', fontSize:18, fontWeight:500, lineHeight:1.35,
            color:'var(--text-1)', marginBottom:10, flex:1, letterSpacing:'-.01em' }}>
            {post.title}
          </h2>
          {post.excerpt && (
            <p style={{ fontSize:13, color:'var(--text-2)', lineHeight:1.65, marginBottom:16,
              display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
              {post.excerpt}
            </p>
          )}
          <PostMeta post={post} size="sm" />
        </div>
      </article>
    </Link>
  )
}

function PostMeta({ post, size='md' }: { post:Post; size?:'sm'|'md' }) {
  const fs = size==='sm' ? 11 : 12
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
      {post.author.avatar && (
        <img src={post.author.avatar} alt={post.author.name}
          style={{ width:22, height:22, borderRadius:'50%', objectFit:'cover', border:'1px solid var(--border)' }} />
      )}
      <span style={{ fontSize:fs, color:'var(--text-3)' }}>{post.author.name}</span>
      {post.publishedAt && <>
        <span style={{ fontSize:fs, color:'var(--text-4)' }}>·</span>
        <span style={{ fontSize:fs, color:'var(--text-3)' }}>{formatDate(post.publishedAt)}</span>
      </>}
      {post.readingTime && <>
        <span style={{ fontSize:fs, color:'var(--text-4)' }}>·</span>
        <span style={{ fontSize:fs, color:'var(--text-3)' }}>{post.readingTime} min read</span>
      </>}
      {!!post.views && <>
        <span style={{ fontSize:fs, color:'var(--text-4)' }}>·</span>
        <span style={{ fontSize:fs, color:'var(--text-3)' }}>{formatNumber(post.views)} views</span>
      </>}
    </div>
  )
}
