import { useState } from 'react'

export default function AlbumArt({ src, alt, size = 260 }) {
  const [loaded, setLoaded] = useState(false)

  const actualSize = Math.min(size, typeof window !== 'undefined' ? window.innerWidth - 80 : size)

  return (
    <div
      style={{
        width: actualSize,
        height: actualSize,
        maxWidth: '100%',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        background: 'var(--color-surface)',
      }}
    >
      {!loaded && (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, var(--color-surface-hover) 25%, var(--color-surface) 50%, var(--color-surface-hover) 75%)',
            backgroundSize: '200% 100%',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}
      <img
        key={src}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: loaded ? 'block' : 'none',
          animation: 'fadeIn 0.3s ease-out',
        }}
      />
    </div>
  )
}
