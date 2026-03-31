'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { authApi, setToken, setStoredUser } from '@/lib/api'
import { Input, Spinner } from '@/components/ui'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    try {
      const { token, user } = await authApi.login(email, password)
      setToken(token)
      setStoredUser(user)
      router.push(from)
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 380 }}>
      <h1 style={{
        fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 500,
        marginBottom: 6, letterSpacing: '-.02em', color: 'var(--text-1)'
      }}>
        Welcome back
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 36 }}>
        Sign in to your editorial dashboard
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <Link href="#" style={{ fontSize: 11, color: 'var(--gold)' }}>
              Forgot password?
            </Link>
          </div>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', borderRadius: 'var(--r-md)',
            background: 'var(--red-dim)', border: '1px solid rgba(248,113,113,.2)',
            fontSize: 13, color: 'var(--red)'
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            height: 42, borderRadius: 'var(--r-md)', background: 'var(--gold)',
            color: '#0A0A0B', fontSize: 13, fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: loading ? .7 : 1,
          }}
        >
          {loading && <Spinner size={14} color="#0A0A0B" />}
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 24 }}>
        Don't have access?{' '}
        <Link href="/register" style={{ color: 'var(--gold)', fontWeight: 500 }}>
          Request access →
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>

      {/* Left — Branding */}
      <div style={{
        background: 'var(--bg-1)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px'
      }}>
        <Link href="/blog" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9, background: 'var(--gold-dim)',
            border: '1px solid var(--gold-border)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2h4v10H2zM8 2h4v4H8zM8 8h4v4H8z" fill="var(--gold)" />
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 16, color: 'var(--text-1)' }}>
            InkForge
          </span>
        </Link>

        <div>
          <blockquote style={{
            fontFamily: 'var(--font-serif)', fontSize: 24, lineHeight: 1.4,
            letterSpacing: '-.02em', color: 'var(--text-1)', marginBottom: 24, fontStyle: 'italic'
          }}>
            "The platform that powers our entire editorial team — fast, clean, and built for scale."
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', background: 'var(--gold-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--gold)', fontSize: 16, fontWeight: 600
            }}>S</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)' }}>Sarah Kim</p>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Head of Content, Acme Corp</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 36 }}>
          {[['38+', 'Authors'], ['284K', 'Monthly readers'], ['99.9%', 'Uptime']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 24, color: 'var(--gold)', marginBottom: 2 }}>{v}</div>
              <div style={{ fontSize: 11, color: 'var(--text-4)' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Form wrapped in Suspense */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', padding: '48px 56px'
      }}>
        <Suspense fallback={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-3)', fontSize: 14 }}>
            <Spinner size={18} />
            Loading…
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}