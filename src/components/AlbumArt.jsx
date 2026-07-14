import { useState } from 'react'

export default function AlbumArt({ src, alt, size = 260 }) {
  const [loaded, setLoaded] = useState(false)

  const actualSize = Math.min(size, typeof window !== 'undefined' ? window.innerWidth - 80 : size)

  return (
    <div
      className="relative shrink-0 overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface)] shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
      style={{
        width: actualSize,
        height: actualSize,
        maxWidth: '100%',
      }}
    >
      {/* Inner border overlay for depth */}
      <div className="absolute inset-0 rounded-[var(--radius-lg)] border border-white/5 pointer-events-none z-10" />

      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-surface-hover)] via-[var(--color-surface)] to-[var(--color-surface-hover)] bg-[length:200%_100%] animate-pulse" />
      )}
      
      <img
        key={src}
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className="w-full h-full object-cover animate-[fadeIn_0.3s_ease-out]"
        style={{ display: loaded ? 'block' : 'none' }}
      />
    </div>
  )
}
