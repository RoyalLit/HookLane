import { useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import useStore from '../store'
import StatBox from '../components/StatBox'
import { saveArtistScore } from '../lib/storage'
import { QuizLoading } from '../components/LoadingSkeleton'
import CountUp from '../components/ui/CountUp'

export default function ScoreScreen() {
  const { score, totalRounds, selectedArtist, newArtist, startQuiz, setQuizLoading, setQuizError, quizLoading, quizError, difficulty, rounds } = useStore()
  const savedRef = useRef(false)

  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true
    if (selectedArtist?.id) {
      saveArtistScore(selectedArtist.id, score, totalRounds, difficulty)
    }
  }, [score, totalRounds, selectedArtist, difficulty])

  const handlePlayAgain = async () => {
    setQuizLoading(true)
    try {
      const { generateRounds } = await import('../lib/quizGenerator')
      const nextRounds = await generateRounds(selectedArtist.name, difficulty)
      startQuiz(selectedArtist, [], nextRounds, difficulty)
    } catch (err) {
      setQuizError(err.message)
    }
  }

  if (quizLoading) {
    return <QuizLoading />
  }

  if (quizError) {
    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 gap-4 text-center">
        <div className="text-sm" style={{ color: 'var(--color-wrong)' }}>{quizError}</div>
        <button
          onClick={handlePlayAgain}
          className="px-7 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white text-sm font-bold uppercase tracking-[0.08em] font-[var(--font-body)] shadow-[0_0_25px_rgba(255,107,53,0.25)] transition-all hover:shadow-[0_0_45px_rgba(255,107,53,0.45)] hover:scale-[1.03] active:scale-[0.97]"
        >
          Try Again
        </button>
        <button
          onClick={newArtist}
          className="px-7 py-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent text-[var(--color-muted)] text-sm font-semibold font-[var(--font-body)] transition-all hover:border-[var(--color-accent)] hover:text-white"
        >
          New Artist
        </button>
      </div>
    )
  }

  const isPerfect = score === totalRounds
  const pct = Math.round((score / totalRounds) * 100)
  const artistName = selectedArtist?.name || 'Unknown Artist'
  const artistId = selectedArtist?.id

  const getMessage = () => {
    if (isPerfect) return 'Perfect!'
    if (pct >= 80) return 'Great job!'
    if (pct >= 60) return 'Not bad!'
    return 'Keep practicing!'
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-[clamp(24px,5vw,48px)] gap-5 text-center">
      {/* Main Score Content - Staggered Entrance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm"
      >
        {/* Step 1: Score Number - 0ms */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div className="flex items-end gap-1">
            <CountUp
              to={score}
              from={0}
              duration={1.5}
              delay={0}
              className="font-[var(--font-mono)] font-bold text-[clamp(48px,12vw,72px)] leading-[1.1]"
              style={{ color: 'var(--color-text-primary)' }}
            />
            <span className="font-[var(--font-mono)] font-medium mb-2" style={{ color: 'var(--color-text-secondary)', fontSize: 'clamp(18px,4vw,28px)' }}>
              /{totalRounds}
            </span>
          </div>

          {/* Step 3: Artist Name - 350ms */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-3 font-bold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {artistName}
          </motion.div>

          {/* Step 4: Contextual Message - 500ms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-2 text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {getMessage()}
          </motion.div>
        </motion.div>

        {/* Step 5: StatBox - 900ms */}
        {artistId && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="mt-6 w-full"
          >
            <StatBox artistId={artistId} currentScore={score} currentOutOf={totalRounds} />
          </motion.div>
        )}

        {/* Step 6: Action Buttons - 1100ms */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.3 }}
          className="mt-4 flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={handlePlayAgain}
            className="px-8 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white text-sm font-bold uppercase tracking-[0.08em] font-[var(--font-body)] shadow-[0_0_25px_rgba(255,107,53,0.25)] transition-all hover:shadow-[0_0_45px_rgba(255,107,53,0.45)] hover:scale-[1.03] active:scale-[0.97]"
          >
            Play Again
          </button>
          <button
            onClick={newArtist}
            className="px-8 py-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-transparent text-[var(--color-muted)] text-sm font-semibold font-[var(--font-body)] transition-all hover:border-[var(--color-accent)] hover:text-white"
          >
            New Artist
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}