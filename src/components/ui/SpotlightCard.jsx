import { useRef, useState } from 'react'

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(255, 107, 53, 0.2)',
  style: extStyle,
}) {
  const divRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  function handleMouseMove(e) {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(0.6)}
      onMouseLeave={() => setOpacity(0)}
      onFocus={() => setOpacity(0.6)}
      onBlur={() => setOpacity(0)}
      className={className}
      style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        overflow: 'hidden',
        padding: 32,
        ...extStyle,
      }}
    >
      <div
        className="pointer-events-none"
        style={{
          position: 'absolute',
          inset: 0,
          opacity,
          transition: 'opacity 0.5s ease-in-out',
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
        }}
      />
      {children}
    </div>
  )
}
