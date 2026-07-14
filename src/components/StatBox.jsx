import { getArtistStats } from '../lib/storage'

export default function StatBox({ artistId, currentScore, currentOutOf }) {
  const stats = getArtistStats(artistId)

  const display = stats.plays === 0
    ? { best: { score: currentScore, outOf: currentOutOf }, plays: 1, last5: [{ score: currentScore, outOf: currentOutOf }] }
    : stats

  const bestPct = display.best ? Math.round((display.best.score / display.best.outOf) * 100) : 0
  const last5Str = display.last5.map(s => `${s.score}/${s.outOf}`).join(', ')

  return (
    <div className="w-full box-border rounded-[20px] p-5 border border-white/5 bg-gradient-to-br from-[#1a1a1e] to-[#121214] backdrop-blur-md">
      <div className="text-white/50 text-[11px] mb-4 font-semibold uppercase tracking-[1.5px] font-body">
        Score History
      </div>
      
      <div className="flex gap-2 justify-between">
        {/* Best Score Chip */}
        <div className="flex-1 text-center bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner">
          <div className="text-[var(--color-accent)] text-2xl sm:text-3xl font-bold font-mono leading-tight drop-shadow-sm">
            {display.best ? `${display.best.score}/${display.best.outOf}` : '—'}
          </div>
          <div className="text-[var(--color-accent)]/60 text-[10px] uppercase tracking-[1.2px] font-body mt-1">
            Best
          </div>
        </div>
        
        {/* Best % Chip */}
        <div className="flex-1 text-center bg-[var(--color-correct)]/10 border border-[var(--color-correct)]/20 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner">
          <div className="text-[var(--color-correct)] text-2xl sm:text-3xl font-bold font-mono leading-tight drop-shadow-sm">
            {bestPct}%
          </div>
          <div className="text-[var(--color-correct)]/60 text-[10px] uppercase tracking-[1.2px] font-body mt-1">
            Best %
          </div>
        </div>
        
        {/* Plays Chip */}
        <div className="flex-1 text-center bg-[#a855f7]/10 border border-[#a855f7]/20 rounded-xl p-2.5 flex flex-col items-center justify-center shadow-inner">
          <div className="text-[#a855f7] text-2xl sm:text-3xl font-bold font-mono leading-tight drop-shadow-sm">
            {display.plays}
          </div>
          <div className="text-[#a855f7]/60 text-[10px] uppercase tracking-[1.2px] font-body mt-1">
            Plays
          </div>
        </div>
      </div>

      {display.last5.length > 0 && (
        <div className="mt-4 pt-3 border-t border-white/5 text-white/30 text-[11px] font-mono tracking-[0.3px]">
          Last 5: {last5Str}
        </div>
      )}
    </div>
  )
}
