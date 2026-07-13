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
              className="px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white border-0 cursor-pointer text-sm font-bold font-[var(--font-body)] shadow-[0_0_25px_rgba(255,107,53,0.25)]"
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
            className="fixed top-5 left-5 z-50 px-4 py-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-black/60 text-[var(--color-muted)] text-xs cursor-pointer font-[var(--font-body)] transition-all hover:border-[var(--color-accent)] hover:text-white"
          >
            ← Back
          </button>
        )}
      </div>
    )
  }

  const LEVELS = [
    {
      id: 'easy',
      label: 'Easy',
      icon: (
        <div className="flex items-end gap-[3px] h-4">
          <div className="w-1 h-[6px] bg-green-500 rounded-[2px]" />
          <div className="w-1 h-[10px] bg-green-500/20 rounded-[2px]" />
          <div className="w-1 h-4 bg-green-500/20 rounded-[2px]" />
        </div>
      ),
      desc: 'Top hits only · Unlimited replays · 10s clip',
      color: '#22C55E',
      bgColor: 'rgba(34,197,94,0.08)',
    },
    {
      id: 'medium',
      label: 'Medium',
      icon: (
        <div className="flex items-end gap-[3px] h-4">
          <div className="w-1 h-[6px] bg-yellow-500 rounded-[2px]" />
          <div className="w-1 h-[10px] bg-yellow-500 rounded-[2px]" />
          <div className="w-1 h-4 bg-yellow-500/20 rounded-[2px]" />
        </div>
      ),
      desc: 'Mixed tracks · 2 replays · 10s clip',
      color: '#EAB308',
      bgColor: 'rgba(234,179,8,0.08)',
    },
    {
      id: 'hard',
      label: 'Hard',
      icon: (
        <div className="flex items-end gap-[3px] h-4">
          <div className="w-1 h-[6px] bg-red-500 rounded-[2px]" />
          <div className="w-1 h-[10px] bg-red-500 rounded-[2px]" />
          <div className="w-1 h-4 bg-red-500 rounded-[2px]" />
        </div>
      ),
      desc: 'Deep cuts only · 1 play · 5s clip',
      color: '#EF4444',
      bgColor: 'rgba(239,68,68,0.08)',
    },
  ]

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Grainient with fade mask so it only appears below Hero */}
        <div className="absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,transparent_0%,black_25%)] [&::-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_25%)]">
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

      {pendingArtist && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-5 bg-[rgba(10,10,11,0.8)] backdrop-blur-[16px] animate-[fadeIn_0.2s_ease-out]">
          <div className="w-full max-w-[400px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-8 flex flex-col items-center shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <div className="mb-6 text-center">
              <p className="text-[var(--color-muted)] text-sm mb-1.5 font-[var(--font-body)]">Start quiz for</p>
              <h2 className="text-white text-[24px] font-extrabold font-[var(--font-display)] m-0">
                {pendingArtist.name}
              </h2>
            </div>
            
            <div role="radiogroup" aria-label="Choose difficulty" className="flex flex-col gap-3 w-full">
              {LEVELS.map((level) => {
                const isSelected = difficulty === level.id
                const borderColor = isSelected
                  ? level.id === 'easy' ? 'border-[#22C55E]' : level.id === 'medium' ? 'border-[#EAB308]' : 'border-[#EF4444]'
                  : 'border-[var(--color-border)]'
                const bgColor = isSelected
                  ? level.id === 'easy' ? 'bg-[rgba(34,197,94,0.08)]' : level.id === 'medium' ? 'bg-[rgba(234,179,8,0.08)]' : 'bg-[rgba(239,68,68,0.08)]'
                  : 'bg-[rgba(255,255,255,0.02)]'
                const hoverBorder = isSelected ? '' : 'hover:border-[var(--color-accent)]'
                const hoverBg = isSelected ? '' : 'hover:bg-[var(--color-accent-subtle)]'
                const iconBgColor = level.id === 'easy' ? 'bg-[rgba(34,197,94,0.08)]' : level.id === 'medium' ? 'bg-[rgba(234,179,8,0.08)]' : 'bg-[rgba(239,68,68,0.08)]'
                const labelColor = level.id === 'easy' ? 'text-[#22C55E]' : level.id === 'medium' ? 'text-[#EAB308]' : 'text-[#EF4444]'
                
                return (
                  <button
                    key={level.id}
                    onClick={() => handleSelectArtist(pendingArtist, level.id)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-[var(--radius-lg)] border transition-all font-[var(--font-body)] w-full text-left ${borderColor} ${bgColor} ${hoverBorder} ${hoverBg}`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-[8px] ${iconBgColor}`}>
                      {level.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold text-base ${labelColor}`}>{level.label}</div>
                      <div className="text-xs text-[var(--color-muted)] mt-[2px]">{level.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setPendingArtist(null)}
              className="mt-6 px-6 py-2.5 rounded-[var(--radius-md)] bg-transparent text-[var(--color-muted)] text-sm cursor-pointer font-[var(--font-body)] transition-all border-0 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
