'use client'
import { Component, ReactNode } from 'react'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    errorMessage: string
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, errorMessage: '' }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, errorMessage: error.message }
    }

    componentDidCatch(error: Error, info: { componentStack: string }) {
        // Log error to console in structured format
        console.error(JSON.stringify({
            level: 'ERROR',
            timestamp: new Date().toISOString(),
            type: 'client_runtime_error',
            message: error.message,
            componentStack: info.componentStack,
        }))
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{
                    minHeight: '40vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '48px 24px',
                    textAlign: 'center',
                }}>
                    <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'var(--red-dim)',
                        border: '1px solid rgba(248,113,113,.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 22,
                        marginBottom: 20,
                    }}>
                        ⚠
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: 22,
                        fontWeight: 500,
                        marginBottom: 10,
                        color: 'var(--text-1)',
                    }}>
                        Something went wrong
                    </h2>
                    <p style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24, maxWidth: 400 }}>
                        {this.state.errorMessage || 'An unexpected error occurred. Please try refreshing the page.'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, errorMessage: '' })}
                        style={{
                            padding: '8px 20px',
                            borderRadius: 'var(--r-md)',
                            background: 'var(--gold)',
                            color: '#0A0A0B',
                            fontSize: 13,
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        Try again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}