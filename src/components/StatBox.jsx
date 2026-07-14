import { getArtistStats } from '../lib/storage'

export default function StatBox({ artistId, currentScore, currentOutOf }) {
  const stats = getArtistStats(artistId)

  const display = stats.plays === 0
    ? { best: { score: currentScore, outOf: currentOutOf }, plays: 1, last5: [{ score: currentScore, outOf: currentOutOf }] }
    : stats

  const bestPct = display.best ? Math.round((display.best.score / display.best.outOf) * 100) : 0
  const last5Str = display.last5.map(s => `${s.score}/${s.outOf}`).join(', ')

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #1a1a1e 0%, #121214 100%)',
        borderRadius: 20,
        padding: '20px 24px',
        border: '1px solid rgba(255,255,255,0.06)',
        width: '100%',
        boxSizing: 'border-box',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 11,
          marginBottom: 16,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontFamily: 'var(--font-body)',
        }}
      >
        Score History
      </div>
      <div style={{ display: 'flex', gap: 0, justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div
            style={{
              background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.4))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.1,
            }}
          >
            {display.best ? `${display.best.score}/${display.best.outOf}` : '—'}
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              fontFamily: 'var(--font-body)',
              marginTop: 4,
            }}
          >
            Best
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div
            style={{
              background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.4))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.1,
            }}
          >
            {bestPct}%
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              fontFamily: 'var(--font-body)',
              marginTop: 4,
            }}
          >
            Best %
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div
            style={{
              background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.4))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.1,
            }}
          >
            {display.plays}
          </div>
          <div
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '1.2px',
              fontFamily: 'var(--font-body)',
              marginTop: 4,
            }}
          >
            Plays
          </div>
        </div>
      </div>
      {display.last5.length > 0 && (
        <div
          style={{
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.3)',
            fontSize: 11,
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.3px',
          }}
        >
          Last 5: {last5Str}
        </div>
      )}
    </div>
  )
}
