'use client'
import React, { useState } from 'react'

/* ─── Button ─── */
type BtnVariant = 'primary'|'ghost'|'outline'|'danger'|'gold'
type BtnSize    = 'xs'|'sm'|'md'|'lg'
export function Button({ variant='outline', size='md', loading, children, className='', style, ...p }:
  { variant?:BtnVariant; size?:BtnSize; loading?:boolean; children:React.ReactNode; className?:string; style?:React.CSSProperties } &
  React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base: React.CSSProperties = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
    fontFamily:'var(--font-sans)', fontWeight:500, cursor:'pointer', border:'none',
    transition:`all var(--t-mid) var(--ease)`, userSelect:'none', whiteSpace:'nowrap',
    opacity: p.disabled||loading ? .45 : 1, pointerEvents: p.disabled||loading ? 'none' : 'auto',
  }
  const sizes: Record<BtnSize, React.CSSProperties> = {
    xs: { height:26, padding:'0 10px', fontSize:11, borderRadius:'var(--r-sm)' },
    sm: { height:32, padding:'0 14px', fontSize:12, borderRadius:'var(--r-md)' },
    md: { height:38, padding:'0 18px', fontSize:13, borderRadius:'var(--r-md)' },
    lg: { height:44, padding:'0 24px', fontSize:14, borderRadius:'var(--r-lg)' },
  }
  const variants: Record<BtnVariant, React.CSSProperties> = {
    primary: { background:'var(--text-1)', color:'var(--bg)' },
    gold:    { background:'var(--gold)', color:'#0A0A0B' },
    outline: { background:'transparent', color:'var(--text-2)', border:'1px solid var(--border-md)' },
    ghost:   { background:'transparent', color:'var(--text-2)' },
    danger:  { background:'var(--red-dim)', color:'var(--red)', border:'1px solid rgba(248,113,113,.2)' },
  }
  return (
    <button style={{ ...base, ...sizes[size], ...variants[variant], ...style }} className={className} {...p}>
      {loading && <Spinner size={12} />}{children}
    </button>
  )
}

/* ─── Badge ─── */
const BADGE_STYLES: Record<string, React.CSSProperties> = {
  default:   { background:'var(--bg-3)', color:'var(--text-2)', border:'1px solid var(--border)' },
  published: { background:'var(--green-dim)', color:'var(--green)', border:'1px solid rgba(74,222,128,.2)' },
  draft:     { background:'var(--amber-dim)', color:'var(--amber)', border:'1px solid rgba(245,158,11,.2)' },
  scheduled: { background:'var(--blue-dim)',  color:'var(--blue)',  border:'1px solid rgba(96,165,250,.2)' },
  archived:  { background:'var(--bg-3)', color:'var(--text-3)', border:'1px solid var(--border)' },
  category:  { background:'var(--gold-dim)', color:'var(--gold)', border:'1px solid var(--gold-border)' },
}
export function Badge({ children, variant='default' }: { children:React.ReactNode; variant?:string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', padding:'3px 10px', borderRadius:99,
      fontSize:11, fontWeight:500, letterSpacing:'.03em', ...BADGE_STYLES[variant]??BADGE_STYLES.default }}>
      {children}
    </span>
  )
}

/* ─── Input ─── */
export function Input({ label, error, icon, className='', ...p }:
  { label?:string; error?:string; icon?:React.ReactNode } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, width:'100%' }}>
      {label && <label style={{ fontSize:11, fontWeight:500, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.07em' }}>{label}</label>}
      <div style={{ position:'relative' }}>
        {icon && <span style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:'var(--text-3)', display:'flex', pointerEvents:'none' }}>{icon}</span>}
        <input
          onFocus={e => { setFocus(true); p.onFocus?.(e) }}
          onBlur={e  => { setFocus(false); p.onBlur?.(e) }}
          style={{ width:'100%', height:38, padding:icon?'0 12px 0 36px':'0 12px', borderRadius:'var(--r-md)',
            background:'var(--bg-2)', border:`1px solid ${error?'var(--red)':focus?'var(--border-hi)':'var(--border-md)'}`,
            color:'var(--text-1)', fontSize:13, outline:'none', transition:`border-color var(--t-fast)`,
            WebkitAppearance:'none' }}
          className={className} {...p}
        />
      </div>
      {error && <p style={{ fontSize:11, color:'var(--red)' }}>{error}</p>}
    </div>
  )
}

/* ─── Textarea ─── */
export function Textarea({ label, error, ...p }:
  { label?:string; error?:string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, width:'100%' }}>
      {label && <label style={{ fontSize:11, fontWeight:500, color:'var(--text-3)', textTransform:'uppercase', letterSpacing:'.07em' }}>{label}</label>}
      <textarea
        onFocus={e => { setFocus(true); p.onFocus?.(e) }}
        onBlur={e  => { setFocus(false); p.onBlur?.(e) }}
        style={{ width:'100%', padding:'10px 12px', borderRadius:'var(--r-md)', resize:'vertical',
          background:'var(--bg-2)', border:`1px solid ${error?'var(--red)':focus?'var(--border-hi)':'var(--border-md)'}`,
          color:'var(--text-1)', fontSize:13, outline:'none', lineHeight:1.6, transition:`border-color var(--t-fast)` }}
        {...p}
      />
      {error && <p style={{ fontSize:11, color:'var(--red)' }}>{error}</p>}
    </div>
  )
}

/* ─── Spinner ─── */
export function Spinner({ size=16, color='currentColor' }: { size?:number; color?:string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"
      style={{ animation:'spin .7s linear infinite', flexShrink:0 }}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  )
}

/* ─── Avatar ─── */
export function Avatar({ src, name, size=36 }: { src?:string; name:string; size?:number }) {
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()
  return src
    ? <img src={src} alt={name} style={{ width:size, height:size, borderRadius:'50%', objectFit:'cover', flexShrink:0 }} />
    : <div style={{ width:size, height:size, borderRadius:'50%', background:'var(--gold-dim)', color:'var(--gold)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*.35, fontWeight:600, flexShrink:0 }}>
        {initials}
      </div>
}

/* ─── Modal ─── */
export function Modal({ open, onClose, title, children, size='md' }:
  { open:boolean; onClose:()=>void; title?:string; children:React.ReactNode; size?:'sm'|'md'|'lg' }) {
  if (!open) return null
  const w = { sm:420, md:560, lg:740 }[size]
  return (
    <div style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(0,0,0,.75)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(4px)' }}
      onClick={onClose}>
      <div style={{ background:'var(--bg-2)', border:'1px solid var(--border-md)', borderRadius:'var(--r-xl)',
        padding:28, width:'100%', maxWidth:w, maxHeight:'88vh', overflowY:'auto' }}
        onClick={e=>e.stopPropagation()}>
        {title && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ fontSize:16, fontWeight:600 }}>{title}</h2>
            <button onClick={onClose} style={{ color:'var(--text-3)', cursor:'pointer', lineHeight:1, fontSize:18, padding:4 }}>✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

/* ─── Skeleton ─── */
export function Skeleton({ w, h=14, rounded=false }: { w?:string|number; h?:number; rounded?:boolean }) {
  return <div className="skeleton" style={{ width:w, height:h, borderRadius:rounded?99:'var(--r-sm)' }} />
}

/* ─── Divider ─── */
export function Divider({ gap=0 }: { gap?:number }) {
  return <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:`${gap}px 0` }} />
}
