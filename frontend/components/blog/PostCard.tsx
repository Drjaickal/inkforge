'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Post } from '@/types'
import { formatDate, formatNumber } from '@/lib/data'
import { Badge } from '@/components/ui'

interface PostCardProps {
  post: Post
  variant?: 'default' | 'featured' | 'compact'
}

export function PostCard({ post, variant = 'default' }: PostCardProps) {
  const [hovered, setHovered] = useState(false)

  if (variant === 'featured') {
    return (
      <Link
        href={`/blog/${post.slug}`}
        style={{ display: 'block', textDecoration: 'none' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <article style={{
          background: 'var(--bg-surface)',
          border: `1px solid ${hovered ? 'var(--border-light)' : 'var(--border)'}`,
          borderRadius: 16,
          overflow: 'hidden',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'border-color 200ms, transform 200ms',
        }}>
          {post.banner && (
            <div style={{ aspectRatio: '16/7', overflow: 'hidden' }}>
              <img
                src={post.banner.url}
                alt={post.banner.alt || post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy"
              />
            </div>
          )}

          <div style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              {(post.categories || []).map(cat => (
                <Badge key={cat.id} variant="category">{cat.name}</Badge>
              ))}
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 400,
              lineHeight: 1.25,
              color: 'var(--text-primary)',
              marginBottom: 12,
            }}>
              {post.title}
            </h2>

            {post.excerpt && (
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                marginBottom: 20,
              }}>
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
      <Link href={`/blog/${post.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <article style={{
          display: 'flex',
          gap: 16,
          padding: '16px 0',
          borderBottom: '1px solid var(--border)',
        }}>
          {post.banner && (
            <img
              src={post.banner.url}
              alt={post.banner.alt || post.title}
              style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 8 }}
              loading="lazy"
            />
          )}

          <div>
            <h3 style={{ fontSize: 14, fontWeight: 500 }}>
              {post.title}
            </h3>

            <p style={{ fontSize: 12 }}>
              {(post.readingTime || 1)} min read
            </p>
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <article style={{
        border: `1px solid ${hovered ? 'rgba(200,184,154,0.3)' : 'var(--border)'}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        {post.banner && (
          <img
            src={post.banner.url}
            alt={post.banner.alt || post.title}
            style={{ width: '100%' }}
          />
        )}

        <div style={{ padding: '20px' }}>
          <h2>{post.title}</h2>

          {post.excerpt && <p>{post.excerpt}</p>}

          <PostMeta post={post} size="sm" />
        </div>
      </article>
    </Link>
  )
}

function PostMeta({ post, size = 'md' }: { post: Post; size?: 'sm' | 'md' }) {
  const fs = size === 'sm' ? 12 : 13

  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <span style={{ fontSize: fs }}>
        {post.author?.name || 'Unknown'}
      </span>

      {post.publishedAt && (
        <span style={{ fontSize: fs }}>
          {formatDate(post.publishedAt)}
        </span>
      )}

      <span style={{ fontSize: fs }}>
        {(post.readingTime || 1)} min
      </span>

      {post.views != null && (
        <span style={{ fontSize: fs }}>
          {formatNumber(post.views)} views
        </span>
      )}
    </div>
  )
}