import { useState } from 'react'

export default function AnswerCard({ track, state, onSelect, index }) {
  const [hovered, setHovered] = useState(false)

  const isDefault = state === 'default'
  const isCorrect = state === 'correct'
  const isWrong = state === 'wrong'
  const isDimmed = state === 'dimmed'

  let containerClasses = 'flex flex-col items-center gap-2 p-2.5 rounded-[var(--radius-lg)] border transition-all duration-150 w-full h-full box-border font-body outline-none appearance-none m-0'
  
  if (isDefault) {
    containerClasses += ' border-[var(--color-border)] bg-[var(--color-surface)] cursor-pointer'
    if (hovered) {
      containerClasses += ' bg-[var(--color-surface-hover)] border-[rgba(255,107,53,0.4)] scale-[1.02]'
    }
  } else if (isCorrect) {
    containerClasses += ' border-[var(--color-correct)] bg-[rgba(34,197,94,0.08)] shadow-[0_0_20px_rgba(34,197,94,0.2)]'
  } else if (isWrong) {
    containerClasses += ' border-[var(--color-wrong)] bg-[rgba(239,68,68,0.08)] animate-shake shadow-[0_0_20px_rgba(239,68,68,0.2)]'
  } else if (isDimmed) {
    containerClasses += ' border-[var(--color-border)] bg-[var(--color-surface)] opacity-35 cursor-default'
  }

  const stateLabel = isCorrect ? ' — Correct!' : isWrong ? ' — Wrong' : ''
  const animationStyle = isDefault ? { animation: `fadeIn 0.3s ease-out ${(index || 0) * 0.08}s both` } : {}

  return (
    <button
      role="radio"
      onClick={isDefault ? onSelect : undefined}
      disabled={!isDefault}
      aria-checked={isCorrect || isWrong ? isCorrect : undefined}
      aria-label={`${track.title}${stateLabel}`}
      aria-disabled={!isDefault}
      className={containerClasses}
      style={animationStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={isDefault ? 0 : -1}
    >
      <div className="relative w-full aspect-square rounded-[var(--radius-sm)] overflow-hidden">
        <img
          src={track.album.cover_big}
          alt={track.title}
          className="w-full h-full object-cover block"
        />
        {(isCorrect || isWrong) && (
          <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md shadow-lg border ${isCorrect ? 'bg-[#22c55e]/20 border-[var(--color-correct)] text-[var(--color-correct)]' : 'bg-[#ef4444]/20 border-[var(--color-wrong)] text-[var(--color-wrong)]'}`}>
            {isCorrect ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>
        )}
      </div>
      <span
        className={`text-[12px] sm:text-[13px] font-semibold text-center leading-[1.2] break-words line-clamp-2 min-h-[29px] sm:min-h-[31px] ${isCorrect ? 'text-[var(--color-correct)]' : isWrong ? 'text-[var(--color-wrong)]' : 'text-white'}`}
      >
        {track.title}
      </span>
    </button>
  )
}
