import useStore from '../store'

export default function QuizProgress() {
  const { currentRound, totalRounds } = useStore()

  function barBg(i) {
    if (i < currentRound) return 'var(--color-accent)'
    if (i === currentRound) return 'rgba(255,107,53,0.4)'
    return 'var(--color-border)'
  }

  return (
    <div
      role="progressbar"
      aria-valuenow={currentRound + 1}
      aria-valuemin={1}
      aria-valuemax={totalRounds}
      aria-label={`Question ${currentRound + 1} of ${totalRounds}`}
      style={{
        display: 'flex',
        gap: 4,
        width: '100%',
      }}
    >
      {Array.from({ length: totalRounds }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background: barBg(i),
            transition: 'background 0.3s',
          }}
        />
      ))}
    </div>
  )
}
