'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { MOCK_POSTS, MOCK_CATEGORIES, slugify } from '@/lib/data'
import { BlockEditor } from '@/components/admin/BlockEditor'
import { SEOPanel } from '@/components/admin/SEOPanel'
import { Badge, Button, Modal } from '@/components/ui'
import type { Block, PostStatus, Category } from '@/types'

interface Props { params: Promise<{ id: string }> }

export default function PostEditorPage({ params }: Props) {

  const [isSponsored, setIsSponsored] = useState(false)
  const { id } = use(params)
  const existing = MOCK_POSTS.find(p => p.id === id)

  const [title, setTitle] = useState(existing?.title ?? '')
  const [slug, setSlug] = useState(existing?.slug ?? '')
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? '')
  const [status, setStatus] = useState<PostStatus>(existing?.status ?? 'DRAFT')
  const [blocks, setBlocks] = useState<Block[]>(existing?.blocks ?? [])
  const [categories, setCategories] = useState<string[]>(existing?.categories.map(c => c.id) ?? [])
  const [seoTitle, setSeoTitle] = useState(existing?.seoTitle ?? '')
  const [seoDescription, setSeoDescription] = useState(existing?.seoDescription ?? '')
  const [bannerUrl, setBannerUrl] = useState(existing?.banner?.url ?? '')

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [rightPanel, setRightPanel] = useState<'details' | 'seo' | 'preview'>('details')
  const [slugManual, setSlugManual] = useState(!!existing?.slug)

  const wordCount = blocks.reduce((sum, b) => {
    if (b.type === 'paragraph') { const c = b.content as { html: string }; return sum + (c.html?.split(/\s+/).filter(Boolean).length ?? 0) }
    if (b.type === 'heading') { const c = b.content as { text: string }; return sum + (c.text?.split(/\s+/).filter(Boolean).length ?? 0) }
    return sum
  }, 0)
  const readingTime = Math.max(1, Math.ceil(wordCount / 230))

  useEffect(() => {
    if (!slugManual && title) setSlug(slugify(title))
  }, [title, slugManual])

  const autoSave = useCallback(async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [])

  useEffect(() => {
    const t = setTimeout(autoSave, 3000)
    return () => clearTimeout(t)
  }, [title, excerpt, blocks, seoTitle, seoDescription])

  async function handlePublish() {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setStatus('PUBLISHED')
    setSaving(false)
    setPublishModalOpen(false)
  }

  const canPublish = title.trim() && slug.trim() && excerpt.trim()

  function buildContent() {
    return {
      excerpt,
      blocks,
      seoTitle,
      seoDescription,
      isSponsored,
      banner: bannerUrl
        ? { url: bannerUrl, alt: title, width: 1200, height: 600 }
        : undefined,
      readingTime: Math.max(
        1,
        Math.ceil(
          blocks.reduce(
            (s: number, b: any) =>
              s +
              (b.content?.html || b.content?.text || "")
                .split(/\s+/)
                .filter(Boolean).length,
            0
          ) / 230
        )
      ),
      wordCount: blocks.reduce(
        (s: number, b: any) =>
          s +
          (b.content?.html || b.content?.text || "")
            .split(/\s+/)
            .filter(Boolean).length,
        0
      ),
    }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden', margin: '-32px -36px' }}>

      {/* Main editor area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>

        {/* Editor toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)', flexShrink: 0, gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/admin/posts" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              ← All posts
            </Link>
            <Badge variant={status === 'PUBLISHED' ? 'published' : status === 'DRAFT' ? 'draft' : 'scheduled'}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Badge>
            {saving && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Saving…</span>}
            {saved && !saving && <span style={{ fontSize: 12, color: 'var(--green)' }}>✓ Saved</span>}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={autoSave}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}
            >
              Save draft
            </button>
            {status !== 'PUBLISHED' ? (
              <button
                onClick={() => setPublishModalOpen(true)}
                disabled={!canPublish}
                style={{
                  padding: '6px 16px', borderRadius: 8, border: 'none',
                  background: canPublish ? 'var(--accent)' : 'var(--bg-overlay)',
                  color: canPublish ? '#0C0C0E' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: 500, cursor: canPublish ? 'pointer' : 'not-allowed',
                  transition: 'all 150ms',
                }}
              >
                Publish
              </button>
            ) : (
              <Link href={`/blog/${slug}`} target="_blank">
                <button style={{ padding: '6px 16px', borderRadius: 8, border: '1px solid rgba(200,184,154,0.3)', background: 'rgba(200,184,154,0.08)', color: 'var(--accent)', fontSize: 13, cursor: 'pointer' }}>
                  View live ↗
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Scrollable editor */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>

            {/* Banner */}
            <div style={{ marginBottom: 32 }}>
              {bannerUrl ? (
                <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 8 }}>
                  <img src={bannerUrl} alt="Banner" style={{ width: '100%', maxHeight: 320, objectFit: 'cover' }} />
                  <button
                    onClick={() => setBannerUrl('')}
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      padding: '5px 10px', borderRadius: 6, fontSize: 12,
                      background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => setBannerUrl('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop')}
                  style={{
                    height: 64, borderRadius: 10, border: '2px dashed var(--border-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8, color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
                    transition: 'border-color 150ms',
                  }}
                >
                  <span style={{ color: 'var(--accent)', fontSize: 18 }}>+</span>
                  Add banner image
                </div>
              )}
            </div>

            {/* Title */}
            <textarea
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title…"
              rows={2}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1.2,
                letterSpacing: '-0.025em', color: 'var(--text-primary)',
                resize: 'none', marginBottom: 16,
              }}
            />

            {/* Slug */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', flexShrink: 0 }}>
                /blog/
              </span>
              <input
                value={slug}
                onChange={e => { setSlug(e.target.value); setSlugManual(true) }}
                placeholder="post-slug"
                style={{ flex: 1, fontSize: 13, background: 'transparent', border: 'none', outline: 'none', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}
              />
              {slugManual && (
                <button onClick={() => { setSlugManual(false); setSlug(slugify(title)) }} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Reset
                </button>
              )}
            </div>

            {/* Excerpt */}
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Write a short excerpt or intro (used as meta description fallback)…"
              rows={2}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontSize: 17, lineHeight: 1.65, color: 'var(--text-secondary)',
                resize: 'none', marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 24,
              }}
            />

            {/* Block editor */}
            <BlockEditor blocks={blocks} onChange={setBlocks} />

            {/* Word count footer */}
            <div style={{ display: 'flex', gap: 20, marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              {[
                { label: 'Words', value: wordCount.toLocaleString() },
                { label: 'Reading time', value: `${readingTime} min` },
                { label: 'Blocks', value: blocks.length },
              ].map(stat => (
                <div key={stat.label}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stat.label}: </span>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 300, display: 'flex', flexDirection: 'column', background: 'var(--bg-surface)', flexShrink: 0, overflow: 'hidden' }}>
        {/* Panel tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {(['details', 'seo', 'preview'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setRightPanel(tab)}
              style={{
                flex: 1, padding: '10px 4px', fontSize: 12, cursor: 'pointer',
                background: rightPanel === tab ? 'var(--bg-overlay)' : 'transparent',
                color: rightPanel === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                border: 'none', borderBottom: rightPanel === tab ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 150ms', textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {rightPanel === 'details' && (
            <>
              {/* Status */}
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Status</p>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as PostStatus)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-overlay)', color: 'var(--text-primary)', fontSize: 13, cursor: 'pointer' }}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Sponsored toggle */}
              <div style={{
                background: 'var(--bg-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-md)',
                padding: 14,
              }}>
                <p style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--text-4)',
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                  marginBottom: 10,
                }}>
                  Sponsored post
                </p>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: 'var(--text-2)',
                }}>
                  <div
                    onClick={() => setIsSponsored(!isSponsored)}
                    style={{
                      width: 36,
                      height: 20,
                      borderRadius: 99,
                      background: isSponsored ? 'var(--amber)' : 'var(--bg-4)',
                      border: '1px solid var(--border-md)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background var(--t-fast)',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: 2,
                      left: isSponsored ? 18 : 2,
                      width: 14,
                      height: 14,
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'left var(--t-fast)',
                    }} />
                  </div>
                  {isSponsored ? 'Sponsored' : 'Not sponsored'}
                </label>
                {isSponsored && (
                  <p style={{ fontSize: 11, color: 'var(--amber)', marginTop: 8 }}>
                    A disclosure banner will appear on the published post.
                  </p>
                )}
              </div>

              {/* Categories */}
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Categories</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {MOCK_CATEGORIES.map(cat => {
                    const checked = categories.includes(cat.id)
                    return (
                      <label key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setCategories(checked ? categories.filter(c => c !== cat.id) : [...categories, cat.id])}
                          style={{ width: 14, height: 14, accentColor: 'var(--accent)', cursor: 'pointer' }}
                        />
                        {cat.name}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Publish requirements */}
              <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Pre-publish checklist</p>
                {[
                  { label: 'Title', ok: !!title.trim() },
                  { label: 'Slug', ok: !!slug.trim() },
                  { label: 'Excerpt', ok: !!excerpt.trim() },
                  { label: 'Banner image', ok: !!bannerUrl },
                  { label: 'Category selected', ok: categories.length > 0 },
                  { label: 'Has content blocks', ok: blocks.length > 0 },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 12 }}>
                    <span style={{ color: item.ok ? 'var(--green)' : 'var(--border-light)' }}>{item.ok ? '✓' : '○'}</span>
                    <span style={{ color: item.ok ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {rightPanel === 'seo' && (
            <SEOPanel
              title={title}
              slug={slug}
              excerpt={excerpt}
              seoTitle={seoTitle}
              seoDescription={seoDescription}
              onSeoTitleChange={setSeoTitle}
              onSeoDescriptionChange={setSeoDescription}
            />
          )}

          {rightPanel === 'preview' && (
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Live preview
              </div>
              <div style={{ padding: 16 }}>
                {bannerUrl && <img src={bannerUrl} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }} />}
                <div style={{ fontSize: 16, fontFamily: 'var(--font-display)', lineHeight: 1.3, color: 'var(--text-primary)', marginBottom: 8 }}>{title || 'Post title…'}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{excerpt || 'Excerpt will appear here…'}</div>
                {slug && (
                  <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>
                    /blog/{slug}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Publish modal */}
      <Modal open={publishModalOpen} onClose={() => setPublishModalOpen(false)} title="Publish post" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This will publish <strong style={{ color: 'var(--text-primary)' }}>{title}</strong> and trigger on-demand ISR revalidation. The post will be live and indexed immediately.
          </p>
          <div style={{ background: 'var(--bg-overlay)', borderRadius: 8, padding: 12 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>URL:</p>
            <p style={{ fontSize: 12, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>/blog/{slug}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setPublishModalOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#0C0C0E', fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Publishing…' : 'Publish now'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
