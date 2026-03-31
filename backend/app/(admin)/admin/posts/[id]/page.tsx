'use client'
// app/(admin)/admin/posts/[id]/page.tsx
// Fetches post from backend, saves via PUT /posts/:id, publishes via PUT /posts/publish/:id
import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { postsApi } from '@/lib/api'
import type { ApiPost, PostStatus } from '@/lib/api'
import { BlockEditor } from '@/components/admin/BlockEditor'
import { SEOPanel } from '@/components/admin/SEOPanel'
import { Badge, Button, Modal, Spinner } from '@/components/ui'
import type { Block } from '@/types'

interface Props { params: Promise<{ id: string }> }

export default function PostEditorPage({ params }: Props) {
  const { id } = use(params)
  const router = useRouter()
  const isNew = id === 'new-draft'

  const [post, setPost] = useState<ApiPost | null>(null)
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [blocks, setBlocks] = useState<Block[]>([])
  const [status, setStatus] = useState<PostStatus>('DRAFT')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishOpen, setPublishOpen] = useState(false)
  const [error, setError] = useState('')
  const [rightPanel, setRightPanel] = useState<'details' | 'seo' | 'preview'>('details')
  const [loading, setLoading] = useState(!isNew)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [bannerError, setBannerError] = useState('')

  // Load existing post
  useEffect(() => {
    if (isNew) return
    postsApi.getBySlug(id).catch(() => {
      // id might be a UUID not a slug — fetch all and find
    })

    // Since your backend uses slug for GET, but we have the UUID here,
    // we load all posts and find by id
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('tcb_token')}` }
    })
      .then(r => r.json())
      .then((posts: ApiPost[]) => {
        const found = posts.find(p => p.id === id)
        if (found) {
          setPost(found)
          setTitle(found.title)
          setSlug(found.slug)
          setStatus(found.status)
          const c = (found.content || {}) as any
          setExcerpt(c.excerpt || '')
          setBlocks(c.blocks || [])
          setSeoTitle(c.seoTitle || '')
          setSeoDesc(c.seoDescription || '')
          setBannerUrl(c.banner?.url || '')
        }
      })
      .catch(err => setError('Failed to load post'))
      .finally(() => setLoading(false))
  }, [id, isNew])

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && title) {
      setSlug(title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'))
    }
  }, [title, post])

  // Build content JSON for backend
  function buildContent() {
    return {
      excerpt,
      blocks,
      seoTitle,
      seoDescription: seoDesc,
      banner: bannerUrl ? { url: bannerUrl, alt: title, width: 1200, height: 600 } : undefined,
      readingTime: Math.max(1, Math.ceil(blocks.reduce((s, b: any) =>
        s + (b.content?.html || b.content?.text || '').split(/\s+/).length, 0) / 230)),
      wordCount: blocks.reduce((s, b: any) =>
        s + (b.content?.html || b.content?.text || '').split(/\s+/).filter(Boolean).length, 0),
    }
  }

  const handleSave = useCallback(async () => {
    if (!title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')
    try {
      const payload = { title, slug, content: buildContent(), status }
      if (isNew || !post) {
        const created = await postsApi.create(payload)
        setPost(created)
        router.replace(`/admin/posts/${created.id}`)
      } else {
        const updated = await postsApi.update(post.id, payload)
        setPost(updated)
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      setError(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [title, slug, excerpt, blocks, seoTitle, seoDesc, bannerUrl, status, post, isNew])

  // Auto-save every 30s
  useEffect(() => {
    if (!title) return
    const t = setTimeout(handleSave, 30000)
    return () => clearTimeout(t)
  }, [title, excerpt, blocks])

  async function handlePublish() {
    if (!post) { await handleSave(); return }
    setPublishing(true)
    try {
      await postsApi.publish(post.id)
      setStatus('PUBLISHED')
      setPublishOpen(false)
    } catch (err: any) {
      setError(err.message || 'Publish failed')
    } finally {
      setPublishing(false)
    }
  }

  const wordCount = blocks.reduce((s: number, b: any) => s + (b.content?.html || b.content?.text || '').split(/\s+/).filter(Boolean).length, 0)
  const readingTime = Math.max(1, Math.ceil(wordCount / 230))
  const canPublish = title.trim() && slug.trim() && excerpt.trim()

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 12 }}>
        <Spinner size={28} />
        <p style={{ fontSize: 13, color: 'var(--text-3)' }}>Loading post…</p>
      </div>
    )
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setBannerError('File too large — max 10MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setBannerError('Please select an image file')
      return
    }

    setBannerUploading(true)
    setBannerError('')

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      if (!cloudName) throw new Error('Cloudinary cloud name not set in .env.local')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'inkforge_unsigned')
      formData.append('folder', 'tcb/posts')

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${dql4syue5}/image/upload`,
        { method: 'POST', body: formData }
      )

      if (!res.ok) throw new Error('Upload failed — check your Cloudinary preset name')

      const data = await res.json()
      setBannerUrl(data.secure_url)

    } catch (err: any) {
      setBannerError(err.message || 'Upload failed. Check your Cloudinary setup.')
    } finally {
      setBannerUploading(false)
      // Reset input so same file can be selected again
      e.target.value = ''
    }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 52px)', overflow: 'hidden', margin: '-32px -36px' }}>

      {/* Editor */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRight: '1px solid var(--border)' }}>
        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg-1)', flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/admin/posts" style={{ fontSize: 12, color: 'var(--text-3)', textDecoration: 'none' }}>← Posts</Link>
            <Badge variant={status === 'PUBLISHED' ? 'published' : 'draft'}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </Badge>
            {saving && <span style={{ fontSize: 11, color: 'var(--text-4)' }}>Saving…</span>}
            {saved && <span style={{ fontSize: 11, color: 'var(--green)' }}>✓ Saved</span>}
            {error && <span style={{ fontSize: 11, color: 'var(--red)' }}>{error}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSave} disabled={saving} style={{
              padding: '6px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
              background: 'var(--bg-2)', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer'
            }}>
              {saving ? 'Saving…' : 'Save draft'}
            </button>
            {status !== 'PUBLISHED'
              ? <button onClick={() => setPublishOpen(true)} disabled={!canPublish} style={{
                padding: '6px 16px', borderRadius: 'var(--r-md)', border: 'none',
                background: canPublish ? 'var(--gold)' : 'var(--bg-3)',
                color: canPublish ? '#0A0A0B' : 'var(--text-4)',
                fontSize: 12, fontWeight: 600, cursor: canPublish ? 'pointer' : 'not-allowed'
              }}>
                Publish
              </button>
              : <Link href={`/blog/${slug}`} target="_blank" style={{
                padding: '6px 14px', borderRadius: 'var(--r-md)', border: '1px solid var(--gold-border)',
                background: 'var(--gold-dim)', color: 'var(--gold)', fontSize: 12, textDecoration: 'none'
              }}>
                View live ↗
              </Link>
            }
          </div>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '40px 60px' }}>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {/* Banner */}
            {/* Banner upload */}
            <div style={{ marginBottom: 28 }}>
              {bannerUrl ? (
                <div style={{ position: 'relative', borderRadius: 'var(--r-lg)', overflow: 'hidden' }}>
                  <img
                    src={bannerUrl}
                    alt="Banner"
                    style={{ width: '100%', maxHeight: 280, objectFit: 'cover', display: 'block' }}
                  />
                  <div style={{
                    position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8
                  }}>
                    <label htmlFor="banner-replace" style={{
                      padding: '5px 12px', borderRadius: 6, fontSize: 11,
                      background: 'rgba(0,0,0,.65)', color: '#fff',
                      cursor: 'pointer', border: 'none',
                    }}>
                      Replace
                      <input
                        id="banner-replace"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleBannerUpload}
                      />
                    </label>
                    <button
                      onClick={() => setBannerUrl('')}
                      style={{
                        padding: '5px 12px', borderRadius: 6, fontSize: 11,
                        background: 'rgba(0,0,0,.65)', color: '#fff', border: 'none', cursor: 'pointer',
                      }}>
                      Remove
                    </button>
                  </div>
                  {bannerUploading && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    }}>
                      <Spinner size={20} color="#fff" />
                      <span style={{ fontSize: 13, color: '#fff' }}>Uploading…</span>
                    </div>
                  )}
                </div>
              ) : (
                <label htmlFor="banner-upload" style={{
                  height: 80, borderRadius: 'var(--r-lg)',
                  border: '2px dashed var(--border-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 10, color: 'var(--text-4)', fontSize: 13,
                  cursor: bannerUploading ? 'not-allowed' : 'pointer',
                  background: bannerUploading ? 'var(--bg-2)' : 'transparent',
                  transition: 'border-color var(--t-fast)',
                }}>
                  {bannerUploading ? (
                    <>
                      <Spinner size={16} />
                      <span style={{ color: 'var(--text-3)' }}>Uploading to Cloudinary…</span>
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="var(--gold)" strokeWidth={1.8} strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Click to upload banner image</span>
                      <span style={{ fontSize: 11, color: 'var(--text-4)' }}>PNG, JPG, WEBP up to 10MB</span>
                    </>
                  )}
                  <input
                    id="banner-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleBannerUpload}
                    disabled={bannerUploading}
                  />
                </label>
              )}
              {bannerError && (
                <p style={{ fontSize: 11, color: 'var(--red)', marginTop: 6 }}>{bannerError}</p>
              )}
            </div>

            {/* Title */}
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title…" rows={2}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'var(--font-serif)', fontSize: 36, lineHeight: 1.2, letterSpacing: '-.025em',
                color: 'var(--text-1)', resize: 'none', marginBottom: 16
              }} />

            {/* Slug */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20,
              padding: '7px 12px', background: 'var(--bg-2)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)'
            }}>
              <span style={{ fontSize: 11, color: 'var(--text-4)', flexShrink: 0 }}>/blog/</span>
              <input value={slug} onChange={e => setSlug(e.target.value)}
                style={{
                  flex: 1, fontSize: 12, background: 'transparent', border: 'none', outline: 'none',
                  color: 'var(--gold)', fontFamily: 'var(--font-mono)'
                }} />
            </div>

            {/* Excerpt */}
            <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)}
              placeholder="Short excerpt (used as meta description)…" rows={2}
              style={{
                width: '100%', background: 'transparent', border: 'none', outline: 'none',
                fontSize: 16, lineHeight: 1.65, color: 'var(--text-2)', resize: 'none',
                marginBottom: 32, borderBottom: '1px solid var(--border)', paddingBottom: 24
              }} />

            <BlockEditor blocks={blocks} onChange={setBlocks} />

            <div style={{ display: 'flex', gap: 20, marginTop: 40, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
              {[{ l: 'Words', v: wordCount.toLocaleString() }, { l: 'Reading time', v: `${readingTime} min` }, { l: 'Blocks', v: blocks.length }].map(s => (
                <div key={s.l}>
                  <span style={{ fontSize: 11, color: 'var(--text-4)' }}>{s.l}: </span>
                  <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 500 }}>{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 288, display: 'flex', flexDirection: 'column', background: 'var(--bg-1)', flexShrink: 0 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
          {(['details', 'seo', 'preview'] as const).map(tab => (
            <button key={tab} onClick={() => setRightPanel(tab)} style={{
              flex: 1, padding: '10px 4px', fontSize: 11, cursor: 'pointer', textTransform: 'capitalize',
              background: rightPanel === tab ? 'var(--bg-2)' : 'transparent',
              color: rightPanel === tab ? 'var(--text-1)' : 'var(--text-4)',
              border: 'none', borderBottom: rightPanel === tab ? '2px solid var(--gold)' : '2px solid transparent'
            }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {rightPanel === 'details' && (
            <>
              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Status</p>
                <select value={status} onChange={e => setStatus(e.target.value as PostStatus)}
                  style={{
                    width: '100%', padding: '7px 10px', borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
                    background: 'var(--bg-3)', color: 'var(--text-1)', fontSize: 12, cursor: 'pointer'
                  }}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>

              <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Pre-publish checklist</p>
                {[
                  { label: 'Title', ok: !!title.trim() },
                  { label: 'Slug', ok: !!slug.trim() },
                  { label: 'Excerpt', ok: !!excerpt.trim() },
                  { label: 'Banner image', ok: !!bannerUrl },
                  { label: 'Content blocks', ok: blocks.length > 0 },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid var(--border)', fontSize: 11 }}>
                    <span style={{ color: item.ok ? 'var(--green)' : 'var(--border-hi)' }}>{item.ok ? '✓' : '○'}</span>
                    <span style={{ color: item.ok ? 'var(--text-2)' : 'var(--text-4)' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {rightPanel === 'seo' && (
            <SEOPanel title={title} slug={slug} excerpt={excerpt}
              seoTitle={seoTitle} seoDescription={seoDesc}
              onSeoTitleChange={setSeoTitle} onSeoDescriptionChange={setSeoDesc} />
          )}
          {rightPanel === 'preview' && (
            <div style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: 14 }}>
              {bannerUrl && <img src={bannerUrl} alt="" style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 'var(--r-sm)', marginBottom: 10 }} />}
              <div style={{ fontSize: 14, fontFamily: 'var(--font-serif)', color: 'var(--text-1)', marginBottom: 8, lineHeight: 1.35 }}>{title || 'Post title…'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>{excerpt || 'Excerpt will appear here…'}</div>
              {slug && <div style={{ marginTop: 10, fontSize: 10, color: 'var(--text-4)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>/blog/{slug}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Publish modal */}
      <Modal open={publishOpen} onClose={() => setPublishOpen(false)} title="Publish post" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.6 }}>
            This will publish <strong style={{ color: 'var(--text-1)' }}>{title}</strong> and make it publicly visible immediately.
          </p>
          <div style={{ background: 'var(--bg-3)', borderRadius: 'var(--r-md)', padding: 12 }}>
            <p style={{ fontSize: 11, color: 'var(--text-4)', marginBottom: 4 }}>URL</p>
            <p style={{ fontSize: 12, color: 'var(--gold)', fontFamily: 'var(--font-mono)' }}>/blog/{slug}</p>
          </div>
          {error && <p style={{ fontSize: 12, color: 'var(--red)' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setPublishOpen(false)} style={{
              padding: '8px 16px', borderRadius: 'var(--r-md)',
              border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-2)', fontSize: 12, cursor: 'pointer'
            }}>
              Cancel
            </button>
            <button onClick={handlePublish} disabled={publishing} style={{
              padding: '8px 20px', borderRadius: 'var(--r-md)', border: 'none',
              background: 'var(--gold)', color: '#0A0A0B', fontSize: 12, fontWeight: 600,
              cursor: publishing ? 'not-allowed' : 'pointer', opacity: publishing ? .7 : 1,
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              {publishing && <Spinner size={12} color="#0A0A0B" />}
              {publishing ? 'Publishing…' : 'Publish now'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
