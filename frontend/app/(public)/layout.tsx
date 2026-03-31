import Link from 'next/link'
import { PublicNav } from '@/components/blog/PublicNav'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <div style={{ flex: 1 }}>{children}</div>
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-surface)',
      padding: '48px 24px 32px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--accent)', marginBottom: 12 }}>INKFORGE</div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 200, lineHeight: 1.65 }}>
              In-depth writing on technology, engineering, and business.
            </p>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 16 }}>
              Content
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/blog" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All Posts</Link>
              <Link href="/blog/category/technology" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Technology</Link>
              <Link href="/blog/category/engineering" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Engineering</Link>
              <Link href="/blog/category/design" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Design</Link>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 16 }}>
              Authors
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/blog/author/alexandra-chen" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Alexandra Chen</Link>
              <Link href="/blog" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All Authors</Link>
            </div>
          </div>

          <div>
            <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 16 }}>
              Admin
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/admin/dashboard" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Dashboard</Link>
              <Link href="/admin/posts" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>All Posts</Link>
              <Link href="/admin/posts/new" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>New Post</Link>
              <Link href="/login" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Sign In</Link>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} The Corporate Blog. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Built with Next.js · Hosted on Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}