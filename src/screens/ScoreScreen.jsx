import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import useStore from '../store'
import StatBox from '../components/StatBox'
import ShareCard from '../components/ShareCard'
import { saveArtistScore } from '../lib/storage'
import { QuizLoading } from '../components/LoadingSkeleton'
import CountUp from '../components/ui/CountUp'

const colors = ['#FF6B35', '#22C55E', '#EF4444', '#3B82F6', '#EAB308', '#A855F7', '#EC4899', '#06B6D4']

function createConfetti() {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2.5 + Math.random() * 2,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 8,
  }))
}

export default function ScoreScreen() {
  const { score, totalRounds, selectedArtist, newArtist, startQuiz, setQuizLoading, setQuizError, quizLoading, quizError, difficulty, rounds } = useStore()
  const [shareModal, setShareModal] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const shareCardRef = useRef(null)
  const savedRef = useRef(false)
  const confettiPieces = useRef(createConfetti())
  const shouldReduceMotion = useReducedMotion()

  const DIFFICULTY_LABELS = {
    easy: { emoji: '🟢', label: 'EASY' },
    medium: { emoji: '🟡', label: 'MEDIUM' },
    hard: { emoji: '🔴', label: 'HARD' },
  }
  const diffLabel = DIFFICULTY_LABELS[difficulty] || DIFFICULTY_LABELS.medium

  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true
    if (selectedArtist?.id) {
      saveArtistScore(selectedArtist.id, score, totalRounds, difficulty)
    }
  }, [score, totalRounds, selectedArtist, difficulty])

  const handleOpenShare = useCallback(() => {
    setShareModal(true)
  }, [])

  const handleDownload = useCallback(async () => {
    if (!shareCardRef.current || downloading) return
    setDownloading(true)
    try {
      const blob = await shareCardRef.current.generate()
      if (!blob) return
      const artistName = selectedArtist?.name || 'Artist'
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hooklane-${artistName.replace(/\s+/g, '-').toLowerCase()}-${score}-${totalRounds}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
      setShareModal(false)
    }
  }, [score, totalRounds, selectedArtist, downloading])

  const generateBlob = useCallback(async () => {
    if (!shareCardRef.current) return null
    return shareCardRef.current.generate()
  }, [])

  const handleWhatsApp = useCallback(async () => {
    const blob = await generateBlob()
    if (!blob) return
    const artistName = selectedArtist?.name || 'Artist'
    const text = encodeURIComponent(
      `I scored ${score}/${totalRounds} (${Math.round((score / totalRounds) * 100)}%) on ${artistName} in Hooklane!`
    )
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
    setShareModal(false)
  }, [score, totalRounds, selectedArtist, generateBlob])

  const handleInstagram = useCallback(async () => {
    const blob = await generateBlob()
    if (!blob) return
    const file = new File([blob], `hooklane-${score}-${totalRounds}.png`, { type: 'image/png' })
    if (navigator.share && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Hooklane' }) } catch {}
    }
    setShareModal(false)
  }, [score, totalRounds, generateBlob])

  const handleMore = useCallback(async () => {
    const blob = await generateBlob()
    if (!blob) return
    const artistName = selectedArtist?.name || 'Artist'
    const file = new File([blob], `hooklane-${score}-${totalRounds}.png`, { type: 'image/png' })
    if (navigator.share && navigator.canShare) {
      const shareData = {
        files: [file],
        title: 'Hooklane Music Quiz',
        text: `I scored ${score}/${totalRounds} (${Math.round((score / totalRounds) * 100)}%) on ${artistName}!`,
      }
      if (navigator.canShare(shareData)) {
        try { await navigator.share(shareData) } catch {}
      }
    }
    setShareModal(false)
  }, [score, totalRounds, selectedArtist, generateBlob])

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
  const avatarUrl = selectedArtist?.picture_big || selectedArtist?.picture_medium

  const getMessage = () => {
    if (isPerfect) return 'Perfect!'
    if (pct >= 80) return 'Great job!'
    if (pct >= 60) return 'Not bad!'
    return 'Keep practicing!'
  }

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-[clamp(24px,5vw,48px)] gap-5 text-center relative overflow-hidden">
      {/* Confetti */}
      {isPerfect && !shouldReduceMotion && (
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {confettiPieces.current.map((p) => (
            <div
              key={p.id}
              className="absolute top-[-10px] rounded-[2px]"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size * 0.6,
                background: p.color,
                animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

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

          {/* Step 2: Percentage Badge - 200ms */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2"
            style={{
              background: 'var(--color-accent-subtle)',
              color: 'var(--color-accent)',
            }}
          >
            {pct}%
          </motion.div>

          {/* Step 3: Artist Name - 350ms */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-3 font-bold"
            style={{ color: 'var(--color-accent)' }}
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

          {/* Step 5: Perfect Badge - 500ms (only on perfect) */}
          {isPerfect && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-[0.08em] mt-3"
              style={{
                background: 'linear-gradient(90deg, var(--color-accent), #FF8C5A)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(255,107,53,0.4)',
              }}
            >
              <span className="animate-pulse" style={{ color: '#FFD700' }}>✦</span>
              Perfect Score
            </motion.div>
          )}
        </motion.div>

        {/* Step 5: ShareCard Preview - 700ms */}
        {rounds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <div
              className="relative rounded-[var(--radius-lg)] overflow-hidden"
              style={{
                width: 200,
                height: 200,
                boxShadow: '0 0 20px var(--color-accent-glow)',
              }}
            >
              <ShareCard
                ref={shareCardRef}
                score={score}
                totalRounds={totalRounds}
                selectedArtist={selectedArtist}
                rounds={rounds}
                difficulty={difficulty}
              />
            </div>
            <button
              onClick={handleOpenShare}
              className="px-6 py-2.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white text-sm font-semibold uppercase tracking-[0.08em] font-[var(--font-body)] shadow-[0_0_25px_rgba(255,107,53,0.25)] transition-all hover:shadow-[0_0_45px_rgba(255,107,53,0.45)] hover:scale-[1.03] active:scale-[0.97]"
            >
              Share Score
            </button>
          </motion.div>
        )}

        {/* Step 6: StatBox - 900ms */}
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

        {/* Step 7: Action Buttons - 1100ms */}
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

      {/* Hidden ShareCard for blob generation */}
      {rounds.length > 0 && (
        <div className="absolute opacity-0 pointer-events-none h-0 overflow-hidden">
          <ShareCard
            ref={shareCardRef}
            score={score}
            totalRounds={totalRounds}
            selectedArtist={selectedArtist}
            rounds={rounds}
            difficulty={difficulty}
          />
        </div>
      )}

      {/* Share Modal */}
      <AnimatePresence>
        {shareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShareModal(false)}
            aria-modal="true"
            role="dialog"
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-[12px] flex flex-col items-center justify-center gap-6 p-6 overflow-auto"
          >
            <motion.div
              initial={{ rotateY: -1080, scale: 1.3, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: -360, scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex-shrink-0"
            >
              <ShareCard
                score={score}
                totalRounds={totalRounds}
                selectedArtist={selectedArtist}
                rounds={rounds}
                difficulty={difficulty}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              className="flex gap-3 flex-shrink-0"
            >
              <ShareButton
                label="WhatsApp"
                color="#25D366"
                onClick={handleWhatsApp}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff" />
                    <path d="M12 2C6.477 2 2 6.477 2 12a9.98 9.98 0 001.372 5.065L2 22l5.047-1.35A9.98 9.98 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.578 0-3.124-.443-4.456-1.277l-.32-.19-3.006.805.804-2.934-.208-.332a8.156 8.156 0 01-1.287-4.472c0-4.514 3.673-8.182 8.182-8.182 4.509 0 8.182 3.668 8.182 8.182 0 4.509-3.673 8.182-8.182 8.182z" fill="#fff" />
                  </svg>
                }
              />
              <ShareButton
                label="Instagram"
                color="#E4405F"
                onClick={handleInstagram}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.8" />
                    <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.8" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="#fff" />
                  </svg>
                }
              />
              <ShareButton
                label="Download"
                color="rgba(255,255,255,0.08)"
                onClick={handleDownload}
                loading={downloading}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                }
              />
              <ShareButton
                label="More"
                color="rgba(255,255,255,0.08)"
                onClick={handleMore}
                icon={
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="5" r="1.5" fill="#fff" />
                    <circle cx="12" cy="12" r="1.5" fill="#fff" />
                    <circle cx="12" cy="19" r="1.5" fill="#fff" />
                  </svg>
                }
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ShareButton({ label, color, onClick, icon, loading }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      disabled={loading}
      aria-label={label}
      className="flex flex-col items-center gap-1.5 px-4.5 py-3.5 rounded-[var(--radius-md)] transition-all min-w-[72px] font-[var(--font-body)]"
      style={{
        background: hover ? color : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hover ? color : 'rgba(255,255,255,0.08)'}`,
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      {icon}
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: hover ? '#fff' : 'rgba(255,255,255,0.6)',
          letterSpacing: '0.03em',
          transition: 'color 0.2s',
        }}
      >
        {loading ? '...' : label}
      </span>
    </button>
  )
}