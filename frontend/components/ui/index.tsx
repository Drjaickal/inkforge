'use client'

import React from 'react'

/* ── Button ── */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = 'outline',
  size = 'md',
  loading,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base = `
    inline-flex items-center justify-center gap-2 font-medium transition-all
    disabled:opacity-40 disabled:cursor-not-allowed select-none
  `
  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-9 px-4 text-sm rounded-lg',
    lg: 'h-11 px-6 text-sm rounded-xl',
  }
  const variants = {
    primary: 'bg-[var(--accent)] text-[#0C0C0E] hover:bg-[var(--accent-bright)] active:scale-[0.98]',
    outline: 'border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] active:scale-[0.98]',
    ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:scale-[0.98]',
    danger: 'bg-[var(--red)] text-white hover:opacity-90 active:scale-[0.98]',
  }
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size={14} /> : null}
      {children}
    </button>
  )
}

/* ── Badge ── */
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'published' | 'draft' | 'scheduled' | 'archived' | 'category'
}

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--bg-overlay)] text-[var(--text-secondary)] border border-[var(--border)]',
    published: 'bg-[rgba(74,222,128,0.1)] text-[var(--green)] border border-[rgba(74,222,128,0.2)]',
    draft: 'bg-[rgba(251,191,36,0.1)] text-[var(--amber)] border border-[rgba(251,191,36,0.2)]',
    scheduled: 'bg-[rgba(96,165,250,0.1)] text-[var(--blue)] border border-[rgba(96,165,250,0.2)]',
    archived: 'bg-[var(--bg-overlay)] text-[var(--text-muted)] border border-[var(--border)]',
    category: 'bg-[rgba(200,184,154,0.1)] text-[var(--accent)] border border-[rgba(200,184,154,0.2)]',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}

/* ── Input ── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </span>
        )}
        <input
          className={`
            w-full h-10 px-3 rounded-lg text-sm
            bg-[var(--bg-elevated)] border border-[var(--border)]
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            focus:border-[var(--accent)] focus:ring-1 focus:ring-[rgba(200,184,154,0.2)]
            transition-colors
            ${icon ? 'pl-9' : ''}
            ${error ? 'border-[var(--red)]' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[var(--red)]">{error}</p>}
    </div>
  )
}

/* ── Textarea ── */
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-3 py-2.5 rounded-lg text-sm resize-none
          bg-[var(--bg-elevated)] border border-[var(--border)]
          text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
          focus:border-[var(--accent)] focus:ring-1 focus:ring-[rgba(200,184,154,0.2)]
          transition-colors
          ${error ? 'border-[var(--red)]' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-[var(--red)]">{error}</p>}
    </div>
  )
}

/* ── Spinner ── */
export function Spinner({ size = 16, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2.5}
      strokeLinecap="round"
      style={{ animation: 'spin .7s linear infinite', flexShrink: 0 }}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}

/* ── Divider ── */
export function Divider({ className = '' }: { className?: string }) {
  return <hr className={`border-[var(--border)] ${className}`} />
}

/* ── Avatar ── */
export function Avatar({ src, name, size = 36 }: { src?: string; name: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return src ? (
    <img
      src={src}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
    />
  ) : (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(200,184,154,0.15)',
        color: 'var(--accent)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 500,
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  )
}

/* ── Skeleton ── */
export function Skeleton({ width, height, className = '' }: { width?: string | number; height?: string | number; className?: string }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height: height ?? 16 }}
    />
  )
}

/* ── Modal ── */
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  if (!open) return null
  const widths = { sm: 400, md: 560, lg: 720 }
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: 24,
          width: '100%',
          maxWidth: widths[size],
          maxHeight: '85vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 500 }}>{title}</h2>
            <button onClick={onClose} style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
