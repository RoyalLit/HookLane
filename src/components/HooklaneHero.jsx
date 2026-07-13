import { useState, useRef, useEffect, useCallback } from 'react'
import GradientText from './ui/GradientText'
import FadeIn from './ui/FadeIn'
import useStore from '../store'
import { searchArtists } from '../lib/api'

const DEFAULT_ALBUMS = [
  'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/db/22/4e/db224ee0-b058-5d06-9a8c-fa10662bd58e/18UMGIM17205.rgb.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d2/89/ac/d289ac98-749e-3822-6b6e-b06aa4815715/859740651597_cover.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/eb/e6/06/ebe606da-e00f-82d3-47f3-b79904eed541/17UM1IM24651.rgb.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e7/49/8f/e7498f65-df8f-bead-d6e3-2a8d4d642a79/886447235317.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/01/6c/0b/016c0b7d-46c3-5c63-a124-278e42e2dc30/26UMGIM14087.rgb.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/aa/11/4aaa112c-0264-4e79-361b-1aec3b9bea3f/5063960816505_cover.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/600x600bb.jpg',
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/87/78/db/8778db0e-988f-74d5-b217-3e898a51625d/886446897370.jpg/600x600bb.jpg',
]

export default function HooklaneHero({ onSelectArtist }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { setToast } = useStore()
  const searchInputRef = useRef(null)
  const abortRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)

    const resizeHandler = () => setIsMobile(window.innerWidth <= 768)
    resizeHandler()
    window.addEventListener('resize', resizeHandler)

    return () => {
      mq.removeEventListener('change', handler)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    abortRef.current?.abort()
    if (!query.trim()) {
      setResults([])
      setFocused(false)
      return
    }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const data = await searchArtists(query.trim(), { signal: controller.signal })
        if (!controller.signal.aborted) {
          setResults(data || [])
          setFocused(true)
        }
      } catch (e) {
        if (e.name !== 'AbortError') setToast('Search failed. Check connection.')
      } finally {
        if (!abortRef.current?.signal.aborted) setSearching(false)
      }
    }, 300)
  }, [query, setToast])

  const handlePlayNow = useCallback(() => {
    searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => searchInputRef.current?.focus(), 350)
  }, [])

  const handleClear = useCallback(() => {
    setQuery('')
    setResults([])
    setFocused(false)
  }, [])

  const handleSelect = useCallback((artist) => {
    setQuery('')
    setResults([])
    setFocused(false)
    onSelectArtist(artist)
  }, [onSelectArtist])

  const vinyls = isMobile
    ? [
        { size: 140, top: '8%', left: '-10%', spin: 10, float: 5, delay: 0, dir: 1, album: DEFAULT_ALBUMS[0] },
        { size: 140, top: '55%', right: '-10%', spin: 12, float: 6, delay: 1, dir: -1, album: DEFAULT_ALBUMS[3] },
      ]
    : [
        { size: 220, top: '5%', left: '-8%', spin: 10, float: 6, delay: 0, dir: 1, album: DEFAULT_ALBUMS[0] },
        { size: 200, top: '8%', right: '-6%', spin: 12, float: 5, delay: 0.4, dir: -1, album: DEFAULT_ALBUMS[2] },
        { size: 240, top: '35%', left: '-10%', spin: 14, float: 7, delay: 0.8, dir: 1, album: DEFAULT_ALBUMS[5] },
        { size: 220, top: '38%', right: '-8%', spin: 16, float: 6, delay: 1.2, dir: -1, album: DEFAULT_ALBUMS[8] },
      ]

  const vinylStyle = (v) => ({
    '--vinyl-size': `${v.size}px`,
    '--spin-duration': `${v.spin}s`,
    '--float-duration': `${v.float}s`,
    '--float-delay': `${v.delay}s`,
    '--rotation-direction': v.dir,
    top: v.top,
    left: v.left,
    right: v.right,
  })

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[100vh] min-h-[100dvh] flex flex-col items-center justify-center px-4 bg-transparent overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
        }}
      >
        {vinyls.map((v, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="fixed pointer-events-none"
            style={vinylStyle(v)}
          >
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'var(--color-surface)',
                  boxShadow: reducedMotion
                    ? 'none'
                    : 'inset 0 0 0 2px rgba(255,255,255,0.03), inset 0 0 0 20px rgba(255,255,255,0.01), inset 0 0 0 40px rgba(255,255,255,0.01), inset 0 0 0 60px rgba(255,255,255,0.005)',
                  animation: reducedMotion
                    ? 'none'
                    : `vinylSpin var(--spin-duration) linear infinite, vinylFloat var(--float-duration) ease-in-out infinite`,
                  animationDelay: `var(--float-delay), var(--float-delay)`,
                  transformOrigin: 'center',
                  transform: `rotateY(calc(var(--rotation-direction) * 180deg))`,
                }}
              >
                <div
                  className="absolute inset-1/4 rounded-full overflow-hidden opacity-10"
                  style={{ transform: 'translate(-50%, -50%)' }}
                >
                  <img src={v.album} alt="" className="w-full h-full object-cover" />
                </div>
                <div
                  className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2" aria-label="Hooklane">
          <span className="font-display font-extrabold text-[20px] tracking-tight text-[var(--color-accent)]">Hook</span>
          <span className="font-display font-extrabold text-[20px] tracking-tight text-[var(--color-text-primary)]">lane</span>
        </div>
        <button
          onClick={handlePlayNow}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-muted)] font-medium text-sm hover:border-[var(--color-accent)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
          aria-label="Play now"
        >
          Play Now
        </button>
      </header>

      <main className="relative z-10 flex flex-col items-center text-center w-full max-w-2xl px-4">
        <FadeIn delay={0.1} className="mb-6">
          <h1 className="font-display font-extrabold tracking-tight text-[clamp(48px,10vw,96px)] leading-[1.05]">
            <GradientText className="inline-block">HOOKLANE</GradientText>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2} className="mb-10 max-w-2xl mx-auto">
          <p className="font-body text-lg sm:text-xl text-[var(--color-text-secondary)] leading-relaxed">
            Guess the song from a 2-second hook. No signup. Pure instinct.
          </p>
        </FadeIn>

        <FadeIn delay={0.3} className="w-full max-w-xl mb-6">
          <div className="relative">
            <div className="flex items-center gap-3 bg-[var(--color-surface)]/70 backdrop-blur-xl border border-[var(--color-border)] rounded-full px-5 py-3 transition-all duration-200 focus-within:border-[var(--color-accent)]/30 focus-within:shadow-[0_0_30px_var(--color-accent-glow)]">
              <svg className="w-5 h-5 text-[var(--color-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                ref={searchInputRef}
                type="text"
                aria-label="Search artists"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 200)}
                placeholder="Search your favorite artist..."
                className="flex-1 bg-transparent text-[var(--color-text-primary)] placeholder-[var(--color-muted)] text-base outline-none font-mono"
                autoComplete="off"
                spellCheck={false}
              />
              {query && (
                <button
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="p-1 text-[var(--color-muted)] hover:text-white transition-colors rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
              {searching && <svg className="w-5 h-5 text-[var(--color-accent)] animate-spin shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
            </div>

            {(focused && results.length > 0) && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden z-10 animate-fadeIn">
                {results.slice(0, 7).map((artist) => (
                  <button
                    key={artist.id}
                    onClick={() => handleSelect(artist)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-[var(--color-surface-hover)] transition-colors font-body focus-visible:outline-none focus-visible:bg-[var(--color-surface-hover)]"
                  >
                    <img
                      src={artist.picture_medium}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1 text-left min-w-0">
                      <span className="font-medium text-sm text-[var(--color-text-primary)] truncate block">{artist.name}</span>
                      <span className="text-xs text-[var(--color-text-secondary)]">{artist.nb_fan ? `${artist.nb_fan.toLocaleString()} fans` : 'Artist'}</span>
                    </div>
                    <svg className="w-4 h-4 text-[var(--color-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                ))}
              </div>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.4} className="mb-6">
          {query.trim() && results.length > 0 && (
            <button
              onClick={() => {
                const topResult = results[0]
                if (topResult) handleSelect(topResult)
              }}
              className="px-8 py-4 rounded-full bg-[var(--color-accent)] text-white font-body font-bold text-sm tracking-wider shadow-[0_0_25px_var(--color-accent-glow)] hover:shadow-[0_0_45px_var(--color-accent-glow)] hover:scale-105 active:scale-95 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]"
              aria-label={`Play ${results[0]?.name}`}
            >
              DROP THE NEEDLE
            </button>
          )}
        </FadeIn>

        <FadeIn delay={0.5} className="mb-12">
          <p className="text-sm text-[var(--color-text-secondary)]/60 font-body">No signup needed · Play as guest</p>
        </FadeIn>

        <FadeIn delay={0.6} className="animate-heroBounce">
          <svg className="w-6 h-6 text-[var(--color-muted)] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </FadeIn>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        @keyframes vinylSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes vinylFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(3deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-heroBounce { animation: none; }
        }
      `}</style>
    </section>
  )
}