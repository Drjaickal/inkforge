import type { Metadata } from 'next'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | The Corporate Blog',
    default: 'The Corporate Blog',
  },
  description: 'In-depth writing on technology, engineering, design, and business.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://thecorporateblog.com'),
  openGraph: {
    type: 'website',
    siteName: 'The Corporate Blog',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@thecorporateblog',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
