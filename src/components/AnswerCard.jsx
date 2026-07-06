import { useState } from 'react'

export default function AnswerCard({ track, state, onSelect, index }) {
  const [hovered, setHovered] = useState(false)

  const isDefault = state === 'default'
  const isCorrect = state === 'correct'
  const isWrong = state === 'wrong'
  const isDimmed = state === 'dimmed'

  let borderColor = 'var(--color-border)'
  let bgColor = 'var(--color-surface)'
  let opacity = 1
  let boxShadow = 'none'
  let transform = 'none'

  if (isDefault && hovered) {
    borderColor = 'rgba(255,107,53,0.4)'
    bgColor = 'var(--color-surface-hover)'
    transform = 'scale(1.02)'
  }

  if (isCorrect) {
    borderColor = 'var(--color-correct)'
    bgColor = 'rgba(34,197,94,0.08)'
    boxShadow = '0 0 20px rgba(34,197,94,0.2)'
  }

  if (isWrong) {
    borderColor = 'var(--color-wrong)'
    bgColor = 'rgba(239,68,68,0.08)'
  }

  if (isDimmed) {
    opacity = 0.35
  }

  return (
    <button
      onClick={isDefault ? onSelect : undefined}
      disabled={!isDefault}
      aria-pressed={isCorrect || isWrong}
      aria-disabled={!isDefault}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: 10,
        borderRadius: 'var(--radius-lg)',
        border: '1px solid',
        borderColor,
        background: bgColor,
        opacity,
        cursor: isDefault ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-body)',
        boxShadow,
        transform,
        animation: isDefault ? `fadeIn 0.3s ease-out ${(index || 0) * 0.08}s both` : 'none',
        outline: 'none',
        WebkitAppearance: 'none',
        margin: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={isDefault ? 0 : -1}
    >
      <img
        src={track.album.cover_big}
        alt={track.title}
        style={{
          width: '100%',
          aspectRatio: '1/1',
          borderRadius: 'var(--radius-sm)',
          objectFit: 'cover',
          display: 'block',
        }}
      />
      <span
        style={{
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.2,
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        }}
      >
        {track.title}
      </span>
    </button>
  )
}
