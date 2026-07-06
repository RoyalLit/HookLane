import { useState, useRef, useEffect } from 'react'
import useStore from '../store'
import { generateRounds } from '../lib/quizGenerator'
import { QuizLoading } from '../components/LoadingSkeleton'
import HooklaneHero from '../components/HooklaneHero'
import HowItWorks from '../components/HowItWorks'
import WhyHooklane from '../components/WhyHooklane'
import TrendingNow from '../components/TrendingNow'
import LeaderboardPreview from '../components/LeaderboardPreview'
import Footer from '../components/Footer'
import Grainient from '../components/Grainient'

export default function SearchScreen() {
  const { setQuizLoading, setToast, startQuiz, quizLoading } = useStore()
  const [loadingTimedOut, setLoadingTimedOut] = useState(false)
  const loadingTimeoutRef = useRef(null)

  useEffect(() => {
    if (quizLoading) {
      loadingTimeoutRef.current = setTimeout(() => {
        setLoadingTimedOut(true)
      }, 15000)
    } else {
      setLoadingTimedOut(false)
    }
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [quizLoading])

  const handleSelectArtist = async (artist) => {
    setLoadingTimedOut(false)
    setQuizLoading(true)
    try {
      const rounds = await generateRounds(artist.name)
      if (rounds.length < 1) {
        setQuizLoading(false)
        setToast('No songs found for this artist. Try another.')
        return
      }
      startQuiz(artist, [], rounds)
    } catch (err) {
      setQuizLoading(false)
      setToast(err.message || 'Failed to load tracks. Try another artist.')
    }
  }

  if (quizLoading) {
    return (
      <div style={{ position: 'relative' }}>
        <QuizLoading />
        {loadingTimedOut ? (
          <div style={{
            position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 10, zIndex: 50,
          }}>
            <button
              onClick={() => setQuizLoading(false)}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'var(--font-body)',
                boxShadow: '0 0 25px rgba(255,107,53,0.25)',
              }}
            >
              Cancel — Try Again
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setQuizLoading(false)
              clearTimeout(loadingTimeoutRef.current)
            }}
            style={{
              position: 'fixed', top: 20, left: 20, zIndex: 50,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'rgba(0,0,0,0.6)',
              color: 'var(--color-muted)',
              fontSize: 12,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)' }}
          >
            ← Back
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}>
        {/* Grainient with fade mask so it only appears below Hero */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          opacity: 0.5,
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)',
        }}>
          <Grainient
            color1="#8A3B1C"
            color2="#4A1F0D"
            color3="#0A0A0B"
            timeSpeed={0.04}
            contrast={1.0}
            saturation={0.8}
            grainAmount={0.03}
            warpStrength={1.5}
            warpFrequency={1.5}
            blendAngle={45}
            blendSoftness={1.5}
            rotationAmount={150}
            noiseScale={1.8}
            zoom={1.5}
          />
        </div>
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <HooklaneHero onSelectArtist={handleSelectArtist} />
        <HowItWorks />
        <WhyHooklane />
        <TrendingNow onSelectArtist={handleSelectArtist} />
        <LeaderboardPreview />
        <Footer />
      </div>
    </div>
  )
}
