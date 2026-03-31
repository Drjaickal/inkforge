export function SponsoredBanner() {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 16px',
            borderRadius: 'var(--r-md)',
            background: 'var(--amber-dim)',
            border: '1px solid rgba(245,158,11,.2)',
            marginBottom: 24,
        }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="var(--amber)" strokeWidth={2} strokeLinecap="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ fontSize: 12, color: 'var(--amber)', margin: 0 }}>
                <strong>Sponsored content.</strong> This article contains paid promotion.
                Our editorial standards are not affected by sponsorships.
            </p>
        </div>
    )
}