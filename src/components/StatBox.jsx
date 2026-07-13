import { getArtistStats } from '../lib/storage'

export default function StatBox({ artistId, currentScore, currentOutOf }) {
  const stats = getArtistStats(artistId)

  const display = stats.plays === 0
    ? { best: { score: currentScore, outOf: currentOutOf }, plays: 1, last5: [{ score: currentScore, outOf: currentOutOf }] }
    : stats

  const bestPct = display.best ? Math.round((display.best.score / display.best.outOf) * 100) : 0
  const last5Str = display.last5.map(s => `${s.score}/${s.outOf}`).join(' \u00b7 ')

  return (
    <div className="mx-auto max-w-[400px] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 px-5">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)] font-[var(--font-body)]">
        SCORE HISTORY
      </div>
      <div className="flex gap-4 justify-center">
        {/* Best Score Chip */}
        <div className="flex flex-col items-center gap-1.5 rounded-lg p-4 bg-[var(--color-accent-subtle)]">
          <div className="font-[var(--font-mono)] font-bold text-[20px] text-[var(--color-accent)]">
            {display.best ? `${display.best.score}/${display.best.outOf}` : '\u2014'}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)] font-[var(--font-body)]">
            BEST SCORE
          </div>
        </div>

        {/* Best % Chip */}
        <div className="flex flex-col items-center gap-1.5 rounded-lg p-4 bg-[var(--color-bg-elevated)]">
          <div className="font-[var(--font-mono)] font-bold text-[20px] text-white">
            {bestPct}%
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)] font-[var(--font-body)]">
            BEST %
          </div>
        </div>

        {/* Plays Chip */}
        <div className="flex flex-col items-center gap-1.5 rounded-lg p-4 bg-[var(--color-bg-elevated)]">
          <div className="font-[var(--font-mono)] font-bold text-[20px] text-white">
            {display.plays}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)] font-[var(--font-body)]">
            PLAYS
          </div>
        </div>
      </div>

      {display.last5.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[var(--color-border)] text-[12px] font-[var(--font-mono)] text-[var(--color-text-secondary)]">
          Last 5: {last5Str}
        </div>
      )}
    </div>
  )
}