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

  // Reliable scroll-to-top when round changes (not just after next button)
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
  if (!round) return <div style={{ color: '#fff', padding: 40, textAlign: 'center' }}>No round data</div>

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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100dvh',
        overflowY: 'auto',
        padding: '16px 12px 48px',
        gap: 12,
        maxWidth: 480,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 1fr',
        width: '100%',
        alignItems: 'center',
      }}>
        <button
          ref={backBtnRef}
          onClick={() => setConfirmExit(true)}
          aria-label="Exit quiz"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
            outline: 'none',
            justifySelf: 'start',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-accent)'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.background = 'rgba(255,107,53,0.1)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,107,53,0.25)'
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.color = 'var(--color-muted)'
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'scale(1)'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.9)'
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1
          style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            margin: 0,
            textAlign: 'center',
          }}
        >
          {selectedArtist?.name}
        </h1>
        <h2
          aria-live="polite"
          style={{
            color: 'var(--color-accent)',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'var(--font-mono)',
            margin: 0,
            textAlign: 'right',
          }}
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
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
          }}
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

      {/* Answer grid */}
      <div
        role="radiogroup"
        aria-label="Choose the correct song"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          width: '100%',
          maxWidth: 400,
        }}
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

      {/* Skip button */}
      {!answered && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 8,
        }}>
          <button
            onClick={() => {
              setAnswered(true)
              setSelectedId('skip')
              answerQuestion('skip')
            }}
            aria-label="Skip this round"
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: 'var(--color-muted)',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-accent)'
              e.currentTarget.style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-border)'
              e.currentTarget.style.color = 'var(--color-muted)'
            }}
          >
            I don't know — Skip
          </button>
        </div>
      )}

      {/* Feedback + Next */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          marginTop: 16,
          minHeight: 84,
          justifyContent: answered ? 'flex-start' : 'flex-end',
        }}
      >
        {answered && (
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              aria-live="polite"
            >
              {selectedId === correctTrack.id ? (
                <span style={{ color: 'var(--color-correct)', fontWeight: 700, fontSize: 15 }}>
                  ✓ Correct!
                </span>
              ) : selectedId === 'skip' ? (
                <span style={{ color: 'var(--color-muted)', fontWeight: 600, fontSize: 14 }}>
                  ✗ {correctTrack.title} <span style={{fontSize: 11}}>(skipped)</span>
                </span>
              ) : (
                <span style={{ color: 'var(--color-wrong)', fontWeight: 600, fontSize: 14 }}>
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
              style={{
                padding: '14px 36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-accent)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-body)',
                border: 'none',
                cursor: 'pointer',
                minHeight: 48,
                transition: 'all 0.2s',
                boxShadow: '0 0 25px rgba(255,107,53,0.25)',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 45px rgba(255,107,53,0.45)'
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 25px rgba(255,107,53,0.25)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.97)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)'
              }}
            >
              {currentRound + 1 >= totalRounds ? 'See Results' : 'Next'}
            </button>
          </motion.div>
        )}
      </div>

      {/* Confirm exit modal */}
      <AnimatePresence>
        {confirmExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              padding: 20,
            }}
            onClick={() => setConfirmExit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 28,
                maxWidth: 340,
                width: '100%',
                textAlign: 'center',
                fontFamily: 'var(--font-body)',
              }}
            >
              <p style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>
                Exit quiz?
              </p>
              <p style={{ color: 'var(--color-muted)', fontSize: 13, margin: '0 0 24px', lineHeight: 1.5 }}>
                Your progress in this round will be lost.
              </p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <button
                  onClick={() => setConfirmExit(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--color-surface-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => { setConfirmExit(false); exitQuiz() }}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: 'var(--color-accent)',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 25px rgba(255,107,53,0.4)'
                    e.currentTarget.style.transform = 'scale(1.03)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.97)'
                  }}
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
