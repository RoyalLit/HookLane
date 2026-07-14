import useStore from '../store'

export default function QuizProgress() {
  const { currentRound, totalRounds } = useStore()

  function getSegmentClasses(i) {
    let classes = 'flex-1 h-1.5 rounded-full transition-all duration-300 '
    if (i < currentRound) {
      classes += 'bg-[var(--color-accent)] opacity-80'
    } else if (i === currentRound) {
      classes += 'bg-[var(--color-accent)] shadow-[0_0_12px_rgba(255,107,53,0.8)] animate-pulse'
    } else {
      classes += 'bg-[var(--color-border)] opacity-50'
    }
    return classes
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={currentRound + 1}
      aria-valuemin={1}
      aria-valuemax={totalRounds}
      aria-label={`Question ${currentRound + 1} of ${totalRounds}`}
      className="flex gap-1.5 w-full"
    >
      {Array.from({ length: totalRounds }, (_, i) => (
        <div key={i} className={getSegmentClasses(i)} />
      ))}
    </div>
  )
}
