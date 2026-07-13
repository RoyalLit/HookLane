import FadeIn from './ui/FadeIn'

export default function LeaderboardPreview() {
  return (
    <section className="relative py-24 px-4 bg-[rgba(10,10,11,0.2)]">
      <div className="mx-auto max-w-[640px] text-center">
        <FadeIn direction="left" scale>
          <h2 className="font-display font-extrabold text-[clamp(28px,5vw,48px)] text-white">
            Leaderboards Coming Soon
          </h2>
          <p className="text-[var(--color-muted)] mt-4 max-w-[400px] mx-auto font-body text-[clamp(14px,1.8vw,16px)] leading-relaxed">
            Create an account to track streaks, earn badges, and compete on global and per-artist leaderboards.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-bold text-sm uppercase tracking-[0.08em] font-[var(--font-body)] shadow-[0_0_25px_rgba(255,107,53,0.25)] hover:shadow-[0_0_45px_rgba(255,107,53,0.45)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-200">
            Create Account to Track Streaks & Rank
          </button>
        </FadeIn>
      </div>
    </section>
  )
}
