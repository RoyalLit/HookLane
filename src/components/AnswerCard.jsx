export default function AnswerCard({ track, state, onSelect }) {
  const isDefault = state === 'default'
  const isCorrect = state === 'correct'
  const isWrong = state === 'wrong'

  return (
    <button
      role="radio"
      onClick={isDefault ? onSelect : undefined}
      disabled={!isDefault}
      aria-checked={isCorrect || isWrong ? isCorrect : undefined}
      aria-disabled={!isDefault}
      aria-label={`${track.title}${isCorrect ? ', Correct' : isWrong ? ', Wrong' : ''}`}
      aria-current={isCorrect || isWrong ? 'true' : undefined}
      tabIndex={isDefault ? 0 : -1}
      className={`
        relative flex flex-col items-center gap-2 p-3 rounded-[var(--radius-lg)]
        border min-h-[120px] w-full transition-all duration-150
        text-center font-[var(--font-body)] outline-none
        ${
          isDefault
            ? 'bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[rgba(255,107,53,0.3)] hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)] cursor-pointer active:scale-[0.97]'
            : isCorrect
            ? 'border-2 border-[var(--color-correct)] bg-[var(--color-correct-subtle)] shadow-[0_0_24px_var(--color-correct-glow)] text-[var(--color-correct)]'
            : isWrong
            ? 'border-2 border-[var(--color-wrong)] bg-[var(--color-wrong-subtle)] shadow-[0_0_24px_var(--color-wrong-glow)] text-[var(--color-wrong)] animate-shake'
            : 'opacity-35 cursor-default border-transparent'
        }
      `}
    >
      <div className="relative w-full aspect-square rounded-[var(--radius-sm)] overflow-hidden">
        <img
          src={track.album.cover_big}
          alt={track.title}
          className="w-full h-full object-cover"
        />
        {isCorrect && (
          <svg
            className="absolute top-2 right-2 w-5 h-5 text-white drop-shadow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {isWrong && (
          <svg
            className="absolute top-2 right-2 w-5 h-5 text-white drop-shadow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        )}
      </div>
      <span className="text-sm font-medium leading-snug overflow-wrap-break-word text-[var(--color-text-primary)]">
        {track.title}
      </span>
    </button>
  )
}
