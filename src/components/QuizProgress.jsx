import useStore from '../store'

export default function QuizProgress() {
  const { currentRound, totalRounds } = useStore()

  return (
    <div
      role="progressbar"
      aria-valuenow={currentRound + 1}
      aria-valuemin={1}
      aria-valuemax={totalRounds}
      aria-label={`Question ${currentRound + 1} of ${totalRounds}`}
      className="flex w-full gap-1.5"
    >
      {Array.from({ length: totalRounds }, (_, i) => (
        <div
          key={i}
          className={`flex-1 h-2 rounded-full transition-all duration-300 ${
            i < currentRound
              ? 'bg-[var(--color-correct)]'
              : i === currentRound
              ? 'w-[10px] bg-[var(--color-accent)] shadow-[0_0_8px_var(--color-accent-glow)] animate-pulse-glow'
              : 'bg-[var(--color-border)]'
          }`}
        />
      ))}
    </div>
  )
}
