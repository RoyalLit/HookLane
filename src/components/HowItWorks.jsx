import { motion } from 'motion/react'
import FadeIn from './ui/FadeIn'

const accent = '#FF6B35'
const steps = [
  {
    num: '01',
    title: 'Search Any Artist',
    desc: "Type any artist's name — from global superstars to your favorite indie band. No account needed.",
    icon: (
      <svg style={{ width: 32, height: 32 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Guess the Clips',
    desc: "Listen to 10-second song previews and pick the right title from 4 options. Deep cuts included.",
    icon: (
      <svg style={{ width: 32, height: 32 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Share Your Score',
    desc: "Prove you're the real fan. Share your result as a beautiful image card with your friends.",
    icon: (
      <svg style={{ width: 32, height: 32 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section style={{ position: 'relative', padding: '96px 16px', background: 'rgba(10,10,11,0.5)', WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeIn direction="left">
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#fff',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            How It Works
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
            Three simple steps to test your music knowledge.
          </p>
        </FadeIn>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 32,
        }}>
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={i * 0.15} distance={80} scale>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: 24,
              }}>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: i * 0.15 + 0.1,
                  }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: accent,
                    marginBottom: 20,
                  }}
                >
                  {step.icon}
                </motion.div>
                <span style={{
                  fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  color: accent,
                  marginBottom: 8,
                }}>
                  {step.num}
                </span>
                <h3 style={{
                  fontSize: 'clamp(16px, 2.5vw, 20px)',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: 8,
                  fontFamily: 'var(--font-display)',
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 'clamp(14px, 1.8vw, 16px)',
                  color: 'var(--color-muted)',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-body)',
                }}>
                  {step.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
