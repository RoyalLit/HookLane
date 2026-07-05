import FadeIn from './ui/FadeIn'
import SpotlightCard from './ui/SpotlightCard'

const features = [
  {
    title: 'Deep Cuts, Not Just Hits',
    desc: "We pull from full discographies — not just top charts. You'll get album tracks that separate casual listeners from real fans.",
    icon: (
      <svg style={{ width: 24, height: 24 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
  },
  {
    title: 'Play as Guest or Sign In',
    desc: 'Jump in instantly with no signup. Or create an account to unlock streaks, badges, and cross-device stats.',
    icon: (
      <svg style={{ width: 24, height: 24 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Shareable Results',
    desc: 'Every game generates a beautiful image card with your score, artist, and album art — ready to share anywhere.',
    icon: (
      <svg style={{ width: 24, height: 24 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Any Artist, Instantly',
    desc: "Millions of artists available through Deezer's catalog. Type a name and start playing in seconds.",
    icon: (
      <svg style={{ width: 24, height: 24 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

export default function WhyHooklane() {
  return (
    <section style={{ position: 'relative', padding: '96px 16px', background: 'rgba(10,10,11,0.4)', WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeIn>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#fff',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Why <span style={{ color: '#FF6B35' }}>Hook</span><span>lane</span>
          </h2>
          <p style={{
            color: 'var(--color-muted)',
            textAlign: 'center',
            marginBottom: 64,
            maxWidth: 400,
            margin: '0 auto 64px',
            fontSize: 'clamp(14px, 1.8vw, 16px)',
            fontFamily: 'var(--font-body)',
          }}>
            Built for music fans who know every B-side.
          </p>
        </FadeIn>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {features.map((feature, i) => (
            <FadeIn key={feature.title} delay={i * 0.1} distance={70} scale>
              <SpotlightCard spotlightColor="rgba(255, 107, 53, 0.15)" style={{ height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(255,107,53,0.1)',
                    border: '1px solid rgba(255,107,53,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FF6B35',
                    flexShrink: 0,
                  }}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: 'clamp(16px, 2.5vw, 20px)',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: 4,
                      fontFamily: 'var(--font-display)',
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      fontSize: 'clamp(14px, 1.8vw, 16px)',
                      color: 'var(--color-muted)',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-body)',
                    }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
