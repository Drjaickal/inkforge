'use client'

import { useState, useCallback, useRef } from 'react'
import type { Block, BlockType } from '@/types'
import { Button } from '@/components/ui'
import { nanoid } from 'nanoid'

interface BlockEditorProps {
  blocks: Block[]
  onChange: (blocks: Block[]) => void
}

const BLOCK_TYPES: Array<{ type: BlockType; label: string; description: string; icon: string }> = [
  { type: 'paragraph', label: 'Paragraph', description: 'Plain text content', icon: '¶' },
  { type: 'heading', label: 'Heading', description: 'H2 or H3 section title', icon: 'H' },
  { type: 'image', label: 'Image', description: 'Upload or embed image', icon: '⬜' },
  { type: 'blockquote', label: 'Quote', description: 'Pull quote or citation', icon: '"' },
  { type: 'list', label: 'Bullet list', description: 'Unordered list', icon: '•' },
  { type: 'ordered-list', label: 'Numbered list', description: 'Ordered list', icon: '1.' },
  { type: 'callout', label: 'Callout', description: 'Highlighted notice', icon: '!' },
  { type: 'code', label: 'Code', description: 'Code block with syntax', icon: '</>' },
  { type: 'faq', label: 'FAQ', description: 'Q&A accordion block', icon: '?' },
  { type: 'divider', label: 'Divider', description: 'Horizontal rule', icon: '—' },
]

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerAfter, setPickerAfter] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const dragRef = useRef<string | null>(null)

  function addBlock(type: BlockType, afterId: string | null) {
    const newBlock: Block = {
      id: nanoid(),
      type,
      order: 0,
      content: defaultContent(type),
    }
    const idx = afterId ? blocks.findIndex(b => b.id === afterId) : blocks.length - 1
    const next = [...blocks]
    next.splice(idx + 1, 0, newBlock)
    onChange(next.map((b, i) => ({ ...b, order: i })))
    setPickerOpen(false)
  }

  function updateBlock(id: string, content: unknown) {
    onChange(blocks.map(b => b.id === id ? { ...b, content } : b))
  }

  function removeBlock(id: string) {
    onChange(blocks.filter(b => b.id !== id).map((b, i) => ({ ...b, order: i })))
  }

  function moveBlock(id: string, dir: 'up' | 'down') {
    const idx = blocks.findIndex(b => b.id === id)
    if (dir === 'up' && idx === 0) return
    if (dir === 'down' && idx === blocks.length - 1) return
    const next = [...blocks]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    onChange(next.map((b, i) => ({ ...b, order: i })))
  }

  return (
    <div style={{ position: 'relative' }}>
      {blocks.length === 0 && (
        <div
          style={{
            border: '2px dashed var(--border-light)', borderRadius: 12,
            padding: '48px 24px', textAlign: 'center',
            color: 'var(--text-muted)', fontSize: 14, cursor: 'pointer',
          }}
          onClick={() => { setPickerAfter(null); setPickerOpen(true) }}
        >
          <div style={{ fontSize: 24, marginBottom: 8 }}>+</div>
          Click to add your first block
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {blocks.map((block, i) => (
          <div
            key={block.id}
            draggable
            onDragStart={() => { dragRef.current = block.id }}
            onDragOver={e => { e.preventDefault(); setDragOver(block.id) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => {
              setDragOver(null)
              if (!dragRef.current || dragRef.current === block.id) return
              const from = blocks.findIndex(b => b.id === dragRef.current)
              const to = blocks.findIndex(b => b.id === block.id)
              const next = [...blocks]
              const [moved] = next.splice(from, 1)
              next.splice(to, 0, moved)
              onChange(next.map((b, i) => ({ ...b, order: i })))
              dragRef.current = null
            }}
            style={{
              position: 'relative',
              borderRadius: 8,
              outline: dragOver === block.id ? '2px solid rgba(200,184,154,0.4)' : 'none',
              transition: 'outline 150ms',
            }}
          >
            <BlockWrapper
              block={block}
              onUpdate={content => updateBlock(block.id, content)}
              onRemove={() => removeBlock(block.id)}
              onMoveUp={() => moveBlock(block.id, 'up')}
              onMoveDown={() => moveBlock(block.id, 'down')}
              canMoveUp={i > 0}
              canMoveDown={i < blocks.length - 1}
              onAddAfter={() => { setPickerAfter(block.id); setPickerOpen(true) }}
            />
          </div>
        ))}
      </div>

      {blocks.length > 0 && (
        <button
          onClick={() => { setPickerAfter(null); setPickerOpen(true) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            marginTop: 16, padding: '10px 16px', borderRadius: 8, width: '100%',
            border: '1px dashed var(--border-light)',
            color: 'var(--text-muted)', fontSize: 13, cursor: 'pointer',
            background: 'transparent', transition: 'all 150ms',
          }}
        >
          <span style={{ fontSize: 16, color: 'var(--accent)' }}>+</span>
          Add block
        </button>
      )}

      {/* Block picker */}
      {pickerOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setPickerOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border-light)',
              borderRadius: 16, padding: 20, width: 480,
              maxHeight: '70vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              Insert block
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {BLOCK_TYPES.map(bt => (
                <button
                  key={bt.type}
                  onClick={() => addBlock(bt.type, pickerAfter)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px', borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-overlay)',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 150ms',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(200,184,154,0.4)'
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)'
                    ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-overlay)'
                  }}
                >
                  <span style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(200,184,154,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'var(--accent)', flexShrink: 0 }}>
                    {bt.icon}
                  </span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>{bt.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{bt.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Block wrapper with controls ── */
function BlockWrapper({ block, onUpdate, onRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown, onAddAfter }: {
  block: Block
  onUpdate: (c: unknown) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  onAddAfter: () => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'flex', gap: 8, alignItems: 'flex-start' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Drag + move handle */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 10, opacity: hover ? 1 : 0,
        transition: 'opacity 150ms', flexShrink: 0,
      }}>
        <button onClick={onMoveUp} disabled={!canMoveUp} style={{ ...iconBtnStyle, opacity: canMoveUp ? 1 : 0.3 }}>▲</button>
        <div style={{ ...iconBtnStyle, cursor: 'grab', userSelect: 'none', fontSize: 10 }}>⣿</div>
        <button onClick={onMoveDown} disabled={!canMoveDown} style={{ ...iconBtnStyle, opacity: canMoveDown ? 1 : 0.3 }}>▼</button>
      </div>

      {/* Block content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <BlockRenderer block={block} onUpdate={onUpdate} />
      </div>

      {/* Actions */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 10,
        opacity: hover ? 1 : 0, transition: 'opacity 150ms', flexShrink: 0,
      }}>
        <button onClick={onAddAfter} title="Add block below" style={{ ...iconBtnStyle, color: 'var(--accent)' }}>+</button>
        <button onClick={onRemove} title="Delete block" style={{ ...iconBtnStyle, color: 'var(--red)' }}>✕</button>
      </div>
    </div>
  )
}

const iconBtnStyle: React.CSSProperties = {
  width: 22, height: 22, borderRadius: 5,
  border: '1px solid var(--border)', background: 'var(--bg-overlay)',
  color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  transition: 'all 150ms',
}

/* ── Block renderer ── */
function BlockRenderer({ block, onUpdate }: { block: Block; onUpdate: (c: unknown) => void }) {
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent',
    border: '1px solid transparent', borderRadius: 8, padding: '8px 10px',
    resize: 'vertical', fontSize: 15, lineHeight: 1.7,
    color: 'var(--text-primary)', transition: 'border-color 150ms',
  }

  if (block.type === 'paragraph') {
    const c = block.content as { html: string }
    return (
      <textarea
        value={c.html || ''}
        onChange={e => onUpdate({ html: e.target.value })}
        placeholder="Write something…"
        rows={3}
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'var(--border-light)')}
        onBlur={e => (e.target.style.borderColor = 'transparent')}
      />
    )
  }

  if (block.type === 'heading') {
    const c = block.content as { level: number; text: string }
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <select
          value={c.level || 2}
          onChange={e => onUpdate({ ...c, level: Number(e.target.value) })}
          style={{ padding: '6px 8px', borderRadius: 6, background: 'var(--bg-overlay)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, flexShrink: 0, cursor: 'pointer' }}
        >
          {[2,3,4].map(l => <option key={l} value={l}>H{l}</option>)}
        </select>
        <input
          value={c.text || ''}
          onChange={e => onUpdate({ ...c, text: e.target.value })}
          placeholder="Heading text…"
          style={{ ...inputStyle, fontSize: c.level === 2 ? 22 : c.level === 3 ? 18 : 16, fontFamily: 'var(--font-display)', fontWeight: 400 }}
        />
      </div>
    )
  }

  if (block.type === 'blockquote') {
    const c = block.content as { text: string; cite?: string }
    return (
      <div style={{ borderLeft: '3px solid var(--accent)', paddingLeft: 16 }}>
        <textarea
          value={c.text || ''}
          onChange={e => onUpdate({ ...c, text: e.target.value })}
          placeholder="Quote text…"
          rows={2}
          style={{ ...inputStyle, fontStyle: 'italic', fontSize: 16 }}
        />
        <input
          value={c.cite || ''}
          onChange={e => onUpdate({ ...c, cite: e.target.value })}
          placeholder="— Attribution (optional)"
          style={{ ...inputStyle, fontSize: 12, color: 'var(--text-muted)' }}
        />
      </div>
    )
  }

  if (block.type === 'list' || block.type === 'ordered-list') {
    const c = block.content as { items: string[] }
    const items = c.items || ['']
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: 'var(--accent)', flexShrink: 0, fontSize: 14, width: 20, textAlign: 'right' }}>
              {block.type === 'ordered-list' ? `${i + 1}.` : '•'}
            </span>
            <input
              value={item}
              onChange={e => {
                const next = [...items]; next[i] = e.target.value
                onUpdate({ items: next })
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); const next = [...items]; next.splice(i + 1, 0, ''); onUpdate({ items: next }) }
                if (e.key === 'Backspace' && item === '' && items.length > 1) { e.preventDefault(); const next = items.filter((_, j) => j !== i); onUpdate({ items: next }) }
              }}
              placeholder={`Item ${i + 1}…`}
              style={{ ...inputStyle, padding: '5px 8px', fontSize: 14 }}
            />
          </div>
        ))}
        <button onClick={() => onUpdate({ items: [...items, ''] })} style={{ fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px 28px' }}>
          + Add item
        </button>
      </div>
    )
  }

  if (block.type === 'callout') {
    const c = block.content as { text: string; variant: string }
    const variantColors = { info: 'var(--blue)', warning: 'var(--amber)', success: 'var(--green)', error: 'var(--red)' }
    return (
      <div style={{ border: `1px solid ${variantColors[c.variant as keyof typeof variantColors] || variantColors.info}`, borderRadius: 8, padding: 12, background: 'rgba(255,255,255,0.02)' }}>
        <select
          value={c.variant || 'info'}
          onChange={e => onUpdate({ ...c, variant: e.target.value })}
          style={{ padding: '4px 8px', borderRadius: 6, background: 'var(--bg-overlay)', border: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: 12, marginBottom: 8, cursor: 'pointer' }}
        >
          {['info', 'warning', 'success', 'error'].map(v => <option key={v} value={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</option>)}
        </select>
        <textarea
          value={c.text || ''}
          onChange={e => onUpdate({ ...c, text: e.target.value })}
          placeholder="Callout text…"
          rows={2}
          style={{ ...inputStyle, fontSize: 14 }}
        />
      </div>
    )
  }

  if (block.type === 'image') {
    const c = block.content as { url?: string; alt?: string; caption?: string }
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 10, padding: 16, background: 'var(--bg-elevated)' }}>
        {c.url ? (
          <div style={{ marginBottom: 12 }}>
            <img src={c.url} alt={c.alt || ''} style={{ maxHeight: 240, borderRadius: 8, objectFit: 'cover', width: '100%' }} />
          </div>
        ) : (
          <div style={{
            height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-overlay)', borderRadius: 8, marginBottom: 12,
            color: 'var(--text-muted)', fontSize: 13, border: '2px dashed var(--border-light)', cursor: 'pointer',
          }}>
            Click to upload image
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <input value={c.url || ''} onChange={e => onUpdate({ ...c, url: e.target.value })} placeholder="Image URL or upload…" style={{ ...inputStyle, fontSize: 13, padding: '6px 10px' }} />
          <input value={c.alt || ''} onChange={e => onUpdate({ ...c, alt: e.target.value })} placeholder="Alt text (required for SEO)" style={{ ...inputStyle, fontSize: 13, padding: '6px 10px' }} />
          <input value={c.caption || ''} onChange={e => onUpdate({ ...c, caption: e.target.value })} placeholder="Caption (optional)" style={{ ...inputStyle, fontSize: 12, padding: '6px 10px', color: 'var(--text-muted)' }} />
        </div>
      </div>
    )
  }

  if (block.type === 'code') {
    const c = block.content as { code: string; language?: string }
    return (
      <div style={{ background: 'var(--bg-overlay)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px', borderBottom: '1px solid var(--border)' }}>
          <select
            value={c.language || 'typescript'}
            onChange={e => onUpdate({ ...c, language: e.target.value })}
            style={{ fontSize: 12, background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            {['typescript', 'javascript', 'python', 'sql', 'bash', 'json', 'css', 'html'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <textarea
          value={c.code || ''}
          onChange={e => onUpdate({ ...c, code: e.target.value })}
          placeholder="// your code here"
          rows={6}
          spellCheck={false}
          style={{ ...inputStyle, fontFamily: 'var(--font-mono)', fontSize: 13, padding: '14px 16px', borderRadius: 0 }}
        />
      </div>
    )
  }

  if (block.type === 'faq') {
    const c = block.content as { items: Array<{ question: string; answer: string }> }
    const items = c.items || [{ question: '', answer: '' }]
    return (
      <div style={{ border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)', fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          FAQ Block
        </div>
        {items.map((item, i) => (
          <div key={i} style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
            <input
              value={item.question}
              onChange={e => { const next = [...items]; next[i] = { ...item, question: e.target.value }; onUpdate({ items: next }) }}
              placeholder={`Question ${i + 1}…`}
              style={{ ...inputStyle, fontWeight: 500, fontSize: 14, marginBottom: 4 }}
            />
            <textarea
              value={item.answer}
              onChange={e => { const next = [...items]; next[i] = { ...item, answer: e.target.value }; onUpdate({ items: next }) }}
              placeholder="Answer…"
              rows={2}
              style={{ ...inputStyle, fontSize: 13, color: 'var(--text-secondary)' }}
            />
          </div>
        ))}
        <button onClick={() => onUpdate({ items: [...items, { question: '', answer: '' }] })} style={{ width: '100%', padding: '10px', fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
          + Add FAQ item
        </button>
      </div>
    )
  }

  if (block.type === 'divider') {
    return <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
  }

  return (
    <div style={{ padding: 12, background: 'var(--bg-overlay)', borderRadius: 8, fontSize: 13, color: 'var(--text-muted)' }}>
      Unknown block type: {block.type}
    </div>
  )
}

function defaultContent(type: BlockType): unknown {
  const map: Record<BlockType, unknown> = {
    paragraph: { html: '' },
    heading: { level: 2, text: '' },
    image: { url: '', alt: '', caption: '' },
    blockquote: { text: '', cite: '' },
    list: { items: [''] },
    'ordered-list': { items: [''] },
    callout: { text: '', variant: 'info' },
    code: { code: '', language: 'typescript' },
    faq: { items: [{ question: '', answer: '' }] },
    divider: {},
    table: { rows: [['', ''], ['', '']] },
    youtube: { url: '' },
  }
  return map[type] ?? {}
}
