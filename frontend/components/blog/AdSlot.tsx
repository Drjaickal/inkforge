'use client'
import { useEffect, useRef, useState } from 'react'

interface AdSlotProps {
    slot?: 'top' | 'inline' | 'sidebar' | 'bottom'
    className?: string
}

export function AdSlot({ slot = 'inline' }: AdSlotProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [ready, setReady] = useState(false)

    // Lazy load — only show ad when element is visible in viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    setReady(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    const sizes = {
        top: { width: '100%', height: 90, label: 'Leaderboard 728×90' },
        inline: { width: '100%', height: 250, label: 'Rectangle 336×280' },
        sidebar: { width: '100%', height: 600, label: 'Half Page 300×600' },
        bottom: { width: '100%', height: 90, label: 'Leaderboard 728×90' },
    }

    const config = sizes[slot]

    return (
        <div
            ref={ref}
            style={{
                width: config.width,
                minHeight: config.height,
                margin: slot === 'inline' ? '32px 0' : '0',
                borderRadius: 'var(--r-lg)',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {ready ? (
                <div style={{
                    width: '100%',
                    height: config.height,
                    background: 'var(--bg-2)',
                    border: '1px dashed var(--border-md)',
                    borderRadius: 'var(--r-lg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                }}>
                    {/* Replace this div content with your real AdSense code */}
                    {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"/> */}
                    {/* <ins className="adsbygoogle" data-ad-slot="YOUR_AD_SLOT_ID" /> */}

                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="var(--text-4)" strokeWidth={1.5} strokeLinecap="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8M12 17v4" />
                    </svg>
                    <span style={{ fontSize: 11, color: 'var(--text-4)', fontWeight: 500 }}>
                        Advertisement
                    </span>
                    <span style={{ fontSize: 10, color: 'var(--text-4)' }}>
                        {config.label}
                    </span>
                </div>
            ) : (
                // Placeholder while waiting for viewport intersection
                <div style={{
                    width: '100%',
                    height: config.height,
                    background: 'var(--bg-2)',
                    borderRadius: 'var(--r-lg)',
                }} />
            )}
        </div>
    )
}