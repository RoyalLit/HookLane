import { useState } from 'react'

export default function AlbumArt({ src, alt, size = 220 }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const actualSize = Math.min(size, typeof window !== 'undefined' ? window.innerWidth - 80 : size)

  return (
    <div
      className="relative flex-shrink-0 overflow-hidden rounded-[var(--radius-lg)]"
      style={{
        width: actualSize,
        height: actualSize,
        maxWidth: '100%',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        background: 'var(--color-surface)',
      }}
    >
      {!loaded && !error && (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, var(--color-surface-hover) 25%, var(--color-surface) 50%, var(--color-surface-hover) 75%)',
            backgroundSize: '200% 100%',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
      {!loaded && error && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--color-surface)' }}>
          <svg
            viewBox="0 0 24 24"
            width="48"
            height="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--color-muted)' }}
            aria-hidden="true"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </div>
      )}
      <img
        key={src}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true); }}
        className={`
          w-full h-full object-cover transition-opacity duration-300
          ${loaded && !error ? 'opacity-100' : 'opacity-0'}
        `}
      />
      {/* Thin border for definition */}
      <div className="absolute inset-0 rounded-[var(--radius-lg)] border border-white/10 pointer-events-none" aria-hidden="true" />
    </div>
  )
}
