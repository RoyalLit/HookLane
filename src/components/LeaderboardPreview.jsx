import FadeIn from './ui/FadeIn'
import StarBorder from './ui/StarBorder'

export default function LeaderboardPreview() {
  return (
    <section style={{ position: 'relative', padding: '96px 16px', background: 'rgba(10,10,11,0.2)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <FadeIn direction="left" scale>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#fff',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Leaderboards Coming Soon
          </h2>
          <p style={{
            color: 'var(--color-muted)',
            marginBottom: 32,
            maxWidth: 400,
            margin: '0 auto 32px',
            fontSize: 'clamp(14px, 1.8vw, 16px)',
            fontFamily: 'var(--font-body)',
            lineHeight: 1.6,
          }}>
            Create an account to track streaks, earn badges, and compete on global and per-artist leaderboards.
          </p>
          <StarBorder
            as="button"
            color="#FF6B35"
            speed="8s"
            thickness={1}
            style={{ display: 'inline-flex' }}
          >
            <span style={{ fontSize: 14 }}>Create Account</span>
          </StarBorder>
        </FadeIn>
      </div>
    </section>
  )
}
