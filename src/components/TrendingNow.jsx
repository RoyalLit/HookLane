import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import FadeIn from './ui/FadeIn'

export default function TrendingNow({ onSelectArtist }) {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchTrending() {
      try {
        // Fetch Apple Music top songs chart
        const rssRes = await fetch('/api/itunesrss/api/v2/us/music/most-played/10/songs.json')
        const rssData = await rssRes.json()
        const songs = rssData?.feed?.results || []
        const seen = new Set()
        const uniqueArtists = []
        for (const song of songs) {
          const name = song.artistName
          if (name && !seen.has(name) && uniqueArtists.length < 10) {
            seen.add(name)
            uniqueArtists.push(name)
          }
        }
        if (uniqueArtists.length === 0) return
        // Look up each artist on Deezer for pics + fan count
        const results = await Promise.allSettled(
          uniqueArtists.map(name =>
            fetch(`/api/deezer/search/artist?q=${encodeURIComponent(name)}&limit=1`)
              .then(r => r.json())
              .then(d => d?.data?.[0])
          )
        )
        const artists = results.map(r => r.status === 'fulfilled' ? r.value : null).filter(Boolean)
        if (!cancelled) setArtists(artists)
      } catch {
        // silent fallback
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchTrending()
    return () => { cancelled = true }
  }, [])

  if (loading || artists.length === 0) return null

  return (
    <section style={{ position: 'relative', padding: '96px 16px', background: 'rgba(10,10,11,0.3)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <FadeIn direction="right">
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: '#fff',
            textAlign: 'center',
            marginBottom: 12,
          }}>
            Trending Right Now
          </h2>
          <p style={{
            color: 'var(--color-muted)',
            textAlign: 'center',
            marginBottom: 48,
            maxWidth: 400,
            margin: '0 auto 48px',
            fontSize: 'clamp(14px, 1.8vw, 16px)',
            fontFamily: 'var(--font-body)',
          }}>
            Jump straight into a quiz with today&apos;s hottest artists.
          </p>
        </FadeIn>

        <FadeIn direction="up" distance={40}>
          <div style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            paddingBottom: 16,
            marginLeft: -16,
            marginRight: -16,
            paddingLeft: 16,
            paddingRight: 16,
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}>
            <style>{`.scrollbar-none::-webkit-scrollbar { display: none; } .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            {artists.slice(0, 10).map((artist, i) => (
              <motion.button
                key={artist.id}
                onClick={() => onSelectArtist(artist)}
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
                style={{
                  scrollSnapAlign: 'start',
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  padding: 16,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  width: 140,
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-surface)'}
              >
                <img
                  src={artist.picture_medium}
                  alt={artist.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
                <div style={{ textAlign: 'center', minWidth: 0 }}>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#fff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    width: '100%',
                    margin: 0,
                  }}>
                    {artist.name}
                  </p>
                  {artist.nb_fan > 0 && (
                    <p style={{
                      fontSize: 12,
                      color: 'var(--color-muted)',
                      marginTop: 2,
                      margin: '2px 0 0 0',
                    }}>
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
