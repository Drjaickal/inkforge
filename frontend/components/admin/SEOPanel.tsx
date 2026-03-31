'use client'

import { useState } from 'react'

interface SEOPanelProps {
  title: string
  slug: string
  excerpt: string
  seoTitle: string
  seoDescription: string
  onSeoTitleChange: (v: string) => void
  onSeoDescriptionChange: (v: string) => void
}

export function SEOPanel({ title, slug, excerpt, seoTitle, seoDescription, onSeoTitleChange, onSeoDescriptionChange }: SEOPanelProps) {
  const [tab, setTab] = useState<'seo' | 'social'>('seo')
  const displayTitle = seoTitle || title
  const displayDesc = seoDescription || excerpt
  const titleLen = displayTitle.length
  const descLen = displayDesc.length

  const titleScore = titleLen >= 30 && titleLen <= 60 ? 'good' : titleLen === 0 ? 'missing' : 'warn'
  const descScore = descLen >= 120 && descLen <= 160 ? 'good' : descLen === 0 ? 'missing' : 'warn'

  const scoreColor = { good: 'var(--green)', warn: 'var(--amber)', missing: 'var(--red)' }

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontSize: 13, fontWeight: 500, marginBottom: 2 }}>SEO & Social</h3>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Optimize for search engines</p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {(['seo', 'social'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '8px', fontSize: 12, cursor: 'pointer',
              background: tab === t ? 'var(--bg-overlay)' : 'transparent',
              color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
              border: 'none', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 150ms',
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tab === 'seo' && (
          <>
            {/* Google preview */}
            <div style={{ background: 'var(--bg-overlay)', borderRadius: 8, padding: 14 }}>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Search preview
              </p>
              <p style={{ fontSize: 13, color: '#4A90E2', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {displayTitle || 'Post title'}
              </p>
              <p style={{ fontSize: 11, color: '#5F6368', marginBottom: 2 }}>
                thecorporateblog.com/blog/{slug || 'post-slug'}
              </p>
              <p style={{ fontSize: 12, color: '#3C4043', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {displayDesc || 'Page description will appear here…'}
              </p>
            </div>

            {/* SEO Title */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>SEO title</label>
                <span style={{ fontSize: 11, color: scoreColor[titleScore] }}>{titleLen}/60</span>
              </div>
              <input
                value={seoTitle}
                onChange={e => onSeoTitleChange(e.target.value)}
                placeholder={title || 'Custom SEO title…'}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)', fontSize: 13,
                }}
              />
              <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: 'var(--bg-overlay)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (titleLen / 60) * 100)}%`, background: scoreColor[titleScore], transition: 'width 200ms, background 200ms', borderRadius: 2 }} />
              </div>
            </div>

            {/* Meta description */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Meta description</label>
                <span style={{ fontSize: 11, color: scoreColor[descScore] }}>{descLen}/160</span>
              </div>
              <textarea
                value={seoDescription}
                onChange={e => onSeoDescriptionChange(e.target.value)}
                placeholder={excerpt || 'Custom meta description…'}
                rows={3}
                style={{
                  width: '100%', padding: '8px 10px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)', fontSize: 13, resize: 'vertical',
                }}
              />
              <div style={{ marginTop: 6, height: 3, borderRadius: 2, background: 'var(--bg-overlay)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, (descLen / 160) * 100)}%`, background: scoreColor[descScore], transition: 'width 200ms, background 200ms', borderRadius: 2 }} />
              </div>
            </div>

            {/* SEO checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { label: 'Title set', ok: titleLen > 0 },
                { label: 'Title length optimal (30–60)', ok: titleScore === 'good' },
                { label: 'Description set', ok: descLen > 0 },
                { label: 'Description length optimal (120–160)', ok: descScore === 'good' },
                { label: 'Slug is clean', ok: !!slug && !/[A-Z\s]/.test(slug) },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 12 }}>
                  <span style={{ color: item.ok ? 'var(--green)' : 'var(--border-light)', fontSize: 14 }}>
                    {item.ok ? '✓' : '○'}
                  </span>
                  <span style={{ color: item.ok ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{item.label}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'social' && (
          <>
            <div style={{ background: 'var(--bg-overlay)', borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{ height: 100, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
                Banner image preview
              </div>
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>{displayTitle || 'Post title'}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>thecorporateblog.com</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              OpenGraph and Twitter card images are auto-generated from the banner image. Set a banner to customize how this post appears when shared on social media.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
