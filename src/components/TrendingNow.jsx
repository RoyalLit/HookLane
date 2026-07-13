import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import FadeIn from './ui/FadeIn'
import { QuizLoading } from './LoadingSkeleton'

export default function TrendingNow({ onSelectArtist }) {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchTrending() {
      try {
        // Fetch Deezer chart artists endpoint
        const res = await fetch('/api/deezer/chart/0/artists?limit=10')
        const data = await res.json()
        const chartArtists = data?.data || []
        if (!cancelled) setArtists(chartArtists.slice(0, 10))
      } catch {
        // silent fallback
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchTrending()
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <section className="relative py-24 px-4 bg-[rgba(10,10,11,0.3)]">
        <div className="mx-auto max-w-[1280px]">
          <FadeIn direction="right">
            <h2 className="font-display font-extrabold text-[clamp(28px,5vw,48px)] text-center text-white mb-3">
              Trending Right Now
            </h2>
            <p className="text-[var(--color-muted)] text-center mb-12 max-w-[400px] mx-auto font-body text-[clamp(14px,1.8vw,16px)]">
              Jump straight into a quiz with today's hottest artists.
            </p>
          </FadeIn>
          <FadeIn direction="up" distance={40}>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x scrollbar-hide" role="list" aria-label="Trending artists">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[140px] snap-start" role="listitem">
                  <QuizLoading />
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    )
  }

  if (artists.length === 0) return null

  return (
    <section className="relative py-24 px-4 bg-[rgba(10,10,11,0.3)]">
      <div className="mx-auto max-w-[1280px]">
        <FadeIn direction="right">
          <h2 className="font-display font-extrabold text-[clamp(28px,5vw,48px)] text-center text-white mb-3">
            Trending Right Now
          </h2>
          <p className="text-[var(--color-muted)] text-center mb-12 max-w-[400px] mx-auto font-body text-[clamp(14px,1.8vw,16px)]">
            Jump straight into a quiz with today's hottest artists.
          </p>
        </FadeIn>

        <FadeIn direction="up" distance={40}>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x scrollbar-hide" role="list" aria-label="Trending artists">
            {artists.map((artist, i) => (
              <motion.button
                key={artist.id}
                onClick={() => onSelectArtist({ name: artist.name, id: artist.id })}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                viewport={{ once: false }}
                transition={{
                  duration: 0.5,
                  delay: 0.1 + i * 0.06,
                  ease: [0.17, 0.67, 0.29, 1],
                }}
                className="flex-shrink-0 w-[140px] snap-start flex flex-col items-center gap-3 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors"
                role="listitem"
              >
                <img
                  src={artist.picture_medium}
                  alt={artist.name}
                  className="w-20 h-20 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="text-center min-w-0 w-full">
                  <p className="font-semibold text-sm text-white truncate w-full">
                    {artist.name}
                  </p>
                  {artist.nb_fan > 0 && (
                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      {artist.nb_fan.toLocaleString()} fans
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
