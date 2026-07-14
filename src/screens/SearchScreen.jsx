import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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
  const { setQuizLoading, setToast, startQuiz, quizLoading, difficulty, setDifficulty } = useStore()
  const [pendingArtist, setPendingArtist] = useState(null)
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

  const handleSelectArtist = async (artist, chosenDifficulty) => {
    const diff = chosenDifficulty || difficulty
    setPendingArtist(null)
    setLoadingTimedOut(false)
    setQuizLoading(true)
    setDifficulty(diff)
    try {
      const rounds = await generateRounds(artist.name, diff)
      if (rounds.length < 1) {
        setQuizLoading(false)
        setToast('No songs found for this artist. Try another.')
        return
      }
      startQuiz(artist, [], rounds, diff)
    } catch (err) {
      setQuizLoading(false)
      setToast(err.message || 'Failed to load tracks. Try another artist.')
    }
  }

  const handleArtistPick = (artist) => {
    setPendingArtist(artist)
  }

  if (quizLoading) {
    return (
      <div className="relative">
        <QuizLoading />
        {loadingTimedOut ? (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-2.5 z-50">
            <button
              onClick={() => setQuizLoading(false)}
              className="px-6 py-3 rounded-md bg-[var(--color-accent)] text-white border-none cursor-pointer text-[13px] font-bold font-body shadow-[0_0_25px_rgba(255,107,53,0.25)] transition-all hover:scale-105 active:scale-95"
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
            className="fixed top-5 left-5 z-50 px-4 py-2 rounded-md border border-[var(--color-border)] bg-black/60 text-[var(--color-muted)] text-[12px] cursor-pointer font-body transition-all hover:border-[var(--color-accent)] hover:text-white"
          >
            ← Back
          </button>
        )}
      </div>
    )
  }

  const LEVELS = [
    { id: 'easy', label: 'Easy', desc: 'Top hits only · Unlimited replays · 10s clip', color: 'var(--color-correct)' },
    { id: 'medium', label: 'Medium', desc: 'Mixed tracks · 2 replays · 10s clip', color: 'var(--color-accent)' },
    { id: 'hard', label: 'Hard', desc: 'Deep cuts only · 1 play · 5s clip', color: 'var(--color-wrong)' },
  ]

  return (
    <div className="relative w-full overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-50" style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)'
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
      
      <div className="relative z-10 flex flex-col">
        <HooklaneHero onSelectArtist={handleArtistPick} />
        <HowItWorks />
        <WhyHooklane />
        <TrendingNow onSelectArtist={handleArtistPick} />
        <LeaderboardPreview />
        <Footer />
      </div>

      <AnimatePresence>
        {pendingArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-5"
            onClick={() => setPendingArtist(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[380px] bg-[var(--color-surface)] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-center"
            >
              <div>
                <p className="text-[var(--color-muted)] text-[13px] m-0 mb-1 font-body">Quiz for</p>
                <h2 className="text-white text-[22px] font-extrabold m-0 font-display truncate">
                  {pendingArtist.name}
                </h2>
              </div>
              
              <div role="radiogroup" aria-label="Choose difficulty" className="flex flex-col gap-3 w-full">
                {LEVELS.map((level) => {
                  const isSelected = difficulty === level.id
                  return (
                    <button
                      key={level.id}
                      onClick={() => handleSelectArtist(pendingArtist, level.id)}
                      className={`flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all duration-200 cursor-pointer font-body w-full group
                        ${isSelected ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10' : 'border-[var(--color-border)] bg-[var(--color-surface-hover)] hover:border-white/30 hover:bg-white/5'}
                      `}
                    >
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: level.color }} />
                      <div>
                        <div className={`font-bold text-[15px] ${isSelected ? 'text-[var(--color-accent)]' : 'text-white group-hover:text-white'}`}>
                          {level.label}
                        </div>
                        <div className="text-[12px] text-[var(--color-muted)] mt-0.5 leading-snug">
                          {level.desc}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setPendingArtist(null)}
                className="mt-2 py-3 rounded-xl border border-[var(--color-border)] bg-transparent text-[var(--color-muted)] text-[13px] cursor-pointer font-body transition-all duration-200 hover:border-white/40 hover:text-white"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
