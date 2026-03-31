'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Input, Button } from '@/components/ui'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', role: '', reason: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  function update(key: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 440, textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 22, color: 'var(--green)' }}>✓</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 12 }}>Request received</h1>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 28 }}>
            We'll review your request and get back to you within 1–2 business days.
          </p>
          <Link href="/login" style={{ fontSize: 14, color: 'var(--accent)' }}>← Back to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 36, textAlign: 'center' }}>
          <Link href="/blog" style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--accent)', display: 'inline-block', marginBottom: 20 }}>TCB</Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 400, marginBottom: 8, letterSpacing: '-0.02em' }}>Request access</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>The editorial platform is invite-only. Tell us about yourself.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Input label="Full name" type="text" placeholder="Your name" value={form.name} onChange={update('name')} required />
            <Input label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={update('email')} required />
          </div>
          <Input label="Company" type="text" placeholder="Where do you work?" value={form.company} onChange={update('company')} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Requested role</label>
            <select
              value={form.role}
              onChange={update('role')}
              required
              style={{ height: 40, padding: '0 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: form.role ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 13, cursor: 'pointer' }}
            >
              <option value="" disabled>Select a role…</option>
              <option value="AUTHOR">Author — Write and submit posts</option>
              <option value="EDITOR">Editor — Edit and publish posts</option>
              <option value="VIEWER">Viewer — Read-only access</option>
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Why do you need access?</label>
            <textarea
              value={form.reason}
              onChange={update('reason')}
              placeholder="Briefly describe how you'll use the platform…"
              rows={3}
              required
              style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 13, resize: 'vertical', fontFamily: 'var(--font-body)' }}
            />
          </div>

          <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
            {loading ? 'Submitting…' : 'Submit request'}
          </Button>
        </form>

        <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 20 }}>
          Already have an account? <Link href="/login" style={{ color: 'var(--accent)' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
