import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import useStore from '../store'
import QuizProgress from '../components/QuizProgress'
import AlbumArt from '../components/AlbumArt'
import PlayButton from '../components/PlayButton'
import AnswerCard from '../components/AnswerCard'

export default function QuizScreen() {
  const { rounds, currentRound, selectedArtist, score, totalRounds, answerQuestion, nextRound, exitQuiz, difficulty } = useStore()

  const DIFFICULTY_CONFIG = {
    easy:   { maxPlays: Infinity, clipDuration: 10 },
    medium: { maxPlays: 2,        clipDuration: 10 },
    hard:   { maxPlays: 1,        clipDuration: 5  },
  }
  const diffConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium
  const shouldReduceMotion = useReducedMotion()
  const [answered, setAnswered] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [confirmExit, setConfirmExit] = useState(false)
  const containerRef = useRef(null)
  const nextBtnRef = useRef(null)
  const backBtnRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'instant' : 'smooth' })
  }, [currentRound, shouldReduceMotion])

  useEffect(() => {
    if (answered && nextBtnRef.current) {
      nextBtnRef.current.focus()
    }
  }, [answered])

  const handleSelect = useCallback((trackId) => {
    if (answered) return
    setAnswered(true)
    setSelectedId(trackId)
    answerQuestion(trackId)
  }, [answered, answerQuestion])

  const handleNext = useCallback(() => {
    setAnswered(false)
    setSelectedId(null)
    nextRound()
    window.scrollTo({ top: 0, behavior: shouldReduceMotion ? 'instant' : 'smooth' })
    setTimeout(() => {
      const playBtn = document.querySelector('button[aria-label="Play preview"]')
      if (playBtn) playBtn.focus()
    }, 100)
  }, [nextRound, shouldReduceMotion])

  const round = rounds[currentRound]
  if (!round) return <div className="text-white p-10 text-center">No round data</div>

  const { correctTrack, options } = round

  function cardState(track) {
    if (!answered) return 'default'
    if (track.id === correctTrack.id) return 'correct'
    if (track.id === selectedId && selectedId !== correctTrack.id) return 'wrong'
    return 'dimmed'
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center min-h-[100dvh] w-full max-w-[480px] mx-auto pt-4 px-4 pb-12 gap-4 box-border"
    >
      <div className="grid grid-cols-[auto_1fr_auto] gap-3 w-full items-center">
        <button
          ref={backBtnRef}
          onClick={() => setConfirmExit(true)}
          aria-label="Exit quiz"
          className="w-9 h-9 rounded-full border border-[var(--color-border)] bg-transparent text-[var(--color-muted)] cursor-pointer flex items-center justify-center transition-all duration-200 outline-none justify-self-start hover:border-[var(--color-accent)] hover:text-white hover:bg-[rgba(255,107,53,0.1)] hover:shadow-[0_0_20px_rgba(255,107,53,0.25)] hover:scale-110 active:scale-90"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-white text-base font-bold font-body m-0 text-center truncate px-2">
          {selectedArtist?.name}
        </h1>
        <h2
          aria-live="polite"
          className="text-[var(--color-accent)] text-[15px] font-bold font-mono m-0 text-right"
        >
          {score}/{totalRounds}
        </h2>
      </div>

      <QuizProgress />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentRound}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-2.5"
        >
          <AlbumArt
            src={selectedArtist?.picture_big || selectedArtist?.picture_medium}
            alt={selectedArtist?.name}
            size={Math.min(160, typeof window !== 'undefined' ? window.innerWidth - 80 : 160)}
          />
          <PlayButton
            key={`btn-${currentRound}`}
            previewUrl={correctTrack.preview}
            autoPlay={!answered}
            maxPlays={diffConfig.maxPlays}
            clipDuration={diffConfig.clipDuration}
          />
        </motion.div>
      </AnimatePresence>

      <div
        role="radiogroup"
        aria-label="Choose the correct song"
        className="grid grid-cols-2 gap-2.5 w-full max-w-[400px]"
      >
        {options.map((opt, i) => (
          <AnswerCard
            key={opt.track.id}
            track={opt.track}
            state={cardState(opt.track)}
            onSelect={() => handleSelect(opt.track.id)}
            index={i}
          />
        ))}
      </div>

      {!answered && (
        <div className="flex justify-center mt-2">
          <button
            onClick={() => {
              setAnswered(true)
              setSelectedId('skip')
              answerQuestion('skip')
            }}
            aria-label="Skip this round"
            className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-md border border-[var(--color-border)] bg-transparent text-[var(--color-muted)] text-[12px] font-semibold font-body cursor-pointer transition-all duration-200 hover:border-[var(--color-accent)] hover:text-white"
          >
            I don't know — Skip
          </button>
        </div>
      )}

      <div className={`flex flex-col items-center gap-3 mt-4 min-h-[84px] w-full ${answered ? 'justify-start' : 'justify-end'}`}>
        {answered && (
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              aria-live="polite"
            >
              {selectedId === correctTrack.id ? (
                <span className="text-[var(--color-correct)] font-bold text-[15px]">✓ Correct!</span>
              ) : selectedId === 'skip' ? (
                <span className="text-[var(--color-muted)] font-semibold text-[14px]">
                  ✗ {correctTrack.title} <span className="text-[11px]">(skipped)</span>
                </span>
              ) : (
                <span className="text-[var(--color-wrong)] font-semibold text-[14px]">
                  ✗ {correctTrack.title}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {answered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              ref={nextBtnRef}
              onClick={handleNext}
              className="px-6 py-3 sm:px-9 sm:py-3.5 rounded-md bg-[var(--color-accent)] text-white text-[13px] font-bold tracking-[0.08em] font-body uppercase border-none cursor-pointer min-h-[48px] shadow-[0_0_25px_rgba(255,107,53,0.25)] transition-all duration-200 hover:shadow-[0_0_45px_rgba(255,107,53,0.45)] hover:scale-[1.03] active:scale-[0.97]"
            >
              {currentRound + 1 >= totalRounds ? 'See Results' : 'Next'}
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {confirmExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-5"
            onClick={() => setConfirmExit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-7 max-w-[340px] w-full text-center font-body"
            >
              <p className="text-white text-base font-semibold m-0 mb-2">
                Exit quiz?
              </p>
              <p className="text-[var(--color-muted)] text-[13px] m-0 mb-6 leading-relaxed">
                Your progress in this round will be lost.
              </p>
              <div className="flex gap-2.5 justify-center">
                <button
                  onClick={() => setConfirmExit(false)}
                  className="px-6 py-3 rounded-md border border-[var(--color-border)] bg-transparent text-white text-[13px] font-semibold cursor-pointer transition-colors duration-200 font-body hover:bg-[var(--color-surface-hover)]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setConfirmExit(false); exitQuiz() }}
                  className="px-6 py-3 rounded-md border-none bg-[var(--color-accent)] text-white text-[13px] font-bold cursor-pointer transition-all duration-200 font-body hover:shadow-[0_0_25px_rgba(255,107,53,0.4)] hover:scale-[1.03] active:scale-[0.97]"
                >
                  Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
