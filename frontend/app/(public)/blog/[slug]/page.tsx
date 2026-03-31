import { SponsoredBanner } from '@/components/blog/SponsoredBanner'
import { AdSlot } from '@/components/blog/AdSlot'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_POSTS, formatDate, formatNumber } from '@/lib/data'
import { Badge } from '@/components/ui'
import { PostCard } from '@/components/blog/PostCard'

export const revalidate = 900

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return MOCK_POSTS.filter(p => p.status === 'PUBLISHED').map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = MOCK_POSTS.find(p => p.slug === slug)
  if (!post) return {}
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.banner ? [{ url: post.banner.url, width: post.banner.width, height: post.banner.height }] : [],
      type: 'article',
      publishedTime: post.publishedAt,
    },
    alternates: { canonical: post.canonicalUrl || `/blog/${slug}` },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params

  const post = MOCK_POSTS.find(p => p.slug === slug && p.status === 'PUBLISHED') as any; // Using 'any' here bypasses the strict property check for 'content'
  if (!post) notFound()

  const related = MOCK_POSTS.filter(p =>
    p.id !== post.id &&
    p.status === 'PUBLISHED' &&
    p.categories.some((c: any) => post.categories.map((pc: any) => pc.id).includes(c.id))
  ).slice(0, 2)

  const toc = [
    { id: 'background', text: 'Background and context', level: 2 },
    { id: 'the-turning-point', text: 'The turning point', level: 2 },
    { id: 'the-decisions', text: 'The decisions that mattered', level: 2 },
    { id: 'connection-pooling', text: 'Connection pooling', level: 3 },
    { id: 'caching-layer', text: 'The caching layer', level: 3 },
    { id: 'lessons', text: 'Lessons for everyone', level: 2 },
  ]

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px 24px 0' }}>
        <nav style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          <Link href="/blog" style={{ color: 'var(--text-secondary)' }}>Blog</Link>
          <span>/</span>
          {post.categories[0] && (
            <>
              <Link href={`/blog/category/${post.categories[0].slug}`} style={{ color: 'var(--text-secondary)' }}>
                {post.categories[0].name}
              </Link>
              <span>/</span>
            </>
          )}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
            {post.title}
          </span>
        </nav>
      </div>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 64, alignItems: 'start' }}>

          <article>
            <header style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {post.categories.map((cat: any) => (
                  <Link key={cat.id} href={`/blog/category/${cat.slug}`}>
                    <Badge variant="category">{cat.name}</Badge>
                  </Link>
                ))}
              </div>

              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 400, lineHeight: 1.15, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 20 }}>
                {post.title}
              </h1>

              {post.excerpt && (
                <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
                  {post.excerpt}
                </p>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 28, borderBottom: '1px solid var(--border)' }}>
                {post.author.avatar && (
                  <img src={post.author.avatar} alt={post.author.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                )}
                <div>
                  <Link href={`/blog/author/${post.author.slug}`} style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', display: 'block' }}>
                    {post.author.name}
                  </Link>
                  <div style={{ display: 'flex', gap: 12, marginTop: 2 }}>
                    {post.publishedAt && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(post.publishedAt)}</span>}
                    {post.readingTime && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {post.readingTime} min read</span>}
                    {post.views != null && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>· {formatNumber(post.views)} views</span>}
                  </div>
                </div>
              </div>
            </header>

            {post.banner && (
              <figure style={{ marginBottom: 40, borderRadius: 12, overflow: 'hidden' }}>
                <img src={post.banner.url} alt={post.banner.alt} width={post.banner.width} height={post.banner.height} style={{ width: '100%', height: 'auto', display: 'block' }} />
                {post.banner.caption && (
                  <figcaption style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 10, textAlign: 'center', fontStyle: 'italic' }}>
                    {post.banner.caption}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="prose">
              {post.content?.blocks && Array.isArray(post.content.blocks) && post.content.blocks.length > 0
                ? <BlockRendererWithAds blocks={post.content.blocks} />
                : <div style={{ color: 'var(--text-2)' }}>
                  {typeof post.content === 'string'
                    ? <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    : JSON.stringify(post.content)}
                </div>
              }
            </div>

            <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {post.categories.map((cat: any) => (
                  <Link key={cat.id} href={`/blog/category/${cat.slug}`}>
                    <Badge variant="category">#{cat.name.toLowerCase()}</Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Author Bio */}
            <div style={{ marginTop: 40, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {post.author.avatar && (
                  <img src={post.author.avatar} alt={post.author.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                )}
                <div>
                  <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>{post.author.name}</p>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{post.author.bio}</p>
                  <Link href={`/blog/author/${post.author.slug}`} style={{ display: 'inline-block', marginTop: 10, fontSize: 13, color: 'var(--accent)' }}>
                    More from this author →
                  </Link>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div style={{ marginTop: 56 }}>
                <h2 style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 24 }}>
                  Related articles
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {related.map((p: any) => <PostCard key={p.id} post={p} />)}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar TOC */}
          <aside style={{ position: 'sticky', top: 88 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
              <p style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 16 }}>
                Contents
              </p>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {toc.map(item => (
                  <a key={item.id} href={`#${item.id}`} className={`toc-link ${item.level === 3 ? 'toc-sub' : ''}`}>
                    {item.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </main>

      <style>{`
        article h2 { font-family: var(--font-display); font-size: 26px; font-weight: 400; margin: 40px 0 16px; letter-spacing: -0.02em; }
        article h3 { font-size: 18px; font-weight: 500; margin: 32px 0 12px; }
        article p { margin-bottom: 20px; }
        article blockquote { border-left: 3px solid var(--accent); padding: 16px 20px; margin: 28px 0; background: var(--bg-elevated); border-radius: 0 8px 8px 0; }
        article blockquote p { margin: 0; color: var(--text-secondary); font-style: italic; font-size: 16px; }
        article a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
        article code { font-family: var(--font-mono); font-size: 13px; background: var(--bg-overlay); padding: 2px 6px; border-radius: 4px; color: var(--accent-warm); }
        .toc-link { display: block; padding: 6px 10px; border-radius: 6px; font-size: 13px; color: var(--text-secondary); line-height: 1.4; text-decoration: none; transition: color 150ms; }
        .toc-link:hover { color: var(--text-primary); background: var(--bg-hover); }
        .toc-sub { padding-left: 22px; border-left: 2px solid var(--border); margin-left: 10px; }
      `}</style>
    </>
  )
}

function BlockRendererWithAds({ blocks }: { blocks: any[] }) {
  let headingCount = 0

  return (
    <>
      {blocks.map((block, i) => {
        const rendered = renderBlock(block, i)

        if (block.type === 'heading') {
          headingCount++
          if (headingCount === 2) {
            return (
              <div key={`wrap-${i}`}>
                {rendered}
                <AdSlot slot="inline" key={`ad-${i}`} />
              </div>
            )
          }
        }
        return rendered
      })}
    </>
  )
}

function renderBlock(block: any, i: number) {
  if (block.type === 'paragraph')
    return <p key={i}>{block.content?.html || block.content?.text || ''}</p>

  if (block.type === 'heading')
    return <h2 key={i} id={`h-${i}`}>{block.content?.text || ''}</h2>

  if (block.type === 'blockquote')
    return <blockquote key={i}><p>{block.content?.text || ''}</p></blockquote>

  if (block.type === 'image' && block.content?.url)
    return (
      <figure key={i}>
        <img src={block.content.url} alt={block.content.alt || ''} />
      </figure>
    )

  if (block.type === 'list')
    return (
      <ul key={i}>
        {(block.content?.items || []).map((item: string, j: number) => (
          <li key={j}>{item}</li>
        ))}
      </ul>
    )

  if (block.type === 'ordered-list')
    return (
      <ol key={i}>
        {(block.content?.items || []).map((item: string, j: number) => (
          <li key={j}>{item}</li>
        ))}
      </ol>
    )

  if (block.type === 'divider')
    return <hr key={i} />

  if (block.type === 'code')
    return (
      <pre key={i}>
        <code>{block.content?.code || ''}</code>
      </pre>
    )

  return null
}