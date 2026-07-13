import { motion } from 'motion/react'
import FadeIn from './ui/FadeIn'

const steps = [
  {
    num: '01',
    title: 'Search Any Artist',
    desc: "Type any artist's name — from global superstars to your favorite indie band. No account needed.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Pick Your Difficulty',
    desc: 'Easy gets you the big hits with unlimited replays. Hard throws deep cuts at you with one listen and a 5-second clip. Choose your challenge.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Guess the Clips',
    desc: 'Audio previews autoplay each round. Identify the song from 4 options — album art included. 10 rounds, no mercy.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Share Your Score',
    desc: 'Your result is stamped with your difficulty badge and score. Download the card or share it directly — prove you\'re the real fan.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section className="relative py-24 px-4">
      <div className="absolute inset-0 bg-[rgba(10,10,11,0.5)] z-[-1] [mask-image:linear-gradient(to_bottom,transparent_0%,black_150px)] [&::-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_150px)]" />
      <div className="mx-auto max-w-[1280px] relative z-10">
        <FadeIn direction="left">
          <h2 className="font-display font-extrabold text-[clamp(28px,5vw,48px)] text-center text-white mb-3">
            How It Works
          </h2>
          <p className="text-[var(--color-muted)] text-center mb-16 max-w-[400px] mx-auto font-body text-[clamp(14px,1.8vw,16px)]">
            Three simple steps to test your music knowledge.
          </p>
        </FadeIn>

        <FadeIn direction="up" distance={40}>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <FadeIn key={step.num} delay={i * 0.15} distance={80} scale>
                <div className="flex flex-col items-center text-center p-6">
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
                    className="w-16 h-16 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-accent)] mb-5"
                  >
                    {step.icon}
                  </motion.div>
                  <span className="font-mono text-xs text-[var(--color-accent)] mb-2">
                    {step.num}
                  </span>
                  <h3 className="font-display font-bold text-[clamp(16px,2.5vw,20px)] text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-[clamp(14px,1.8vw,16px)] text-[var(--color-muted)] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
