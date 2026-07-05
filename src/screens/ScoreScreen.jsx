import { useEffect, useRef, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import useStore from '../store'
import StatBox from '../components/StatBox'
import ShareCard from '../components/ShareCard'
import ProfileCard from '../components/ProfileCard'
import { saveArtistScore } from '../lib/storage'
import { generateRounds } from '../lib/quizGenerator'
import { QuizLoading } from '../components/LoadingSkeleton'

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

function ShareButton({ label, color, onClick, children }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        padding: '14px 18px',
        borderRadius: 'var(--radius-md)',
        background: hover ? color : 'rgba(255,255,255,0.04)',
        border: `1px solid ${hover ? color : 'rgba(255,255,255,0.08)'}`,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minWidth: 72,
        fontFamily: 'var(--font-body)',
        transform: hover ? 'translateY(-2px)' : 'none',
      }}
    >
      {children}
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        color: hover ? '#fff' : 'rgba(255,255,255,0.6)',
        letterSpacing: '0.03em',
        transition: 'color 0.2s',
      }}>
        {label}
      </span>
    </button>
  )
}

export default function ScoreScreen() {
  const { score, totalRounds, selectedArtist, newArtist, startQuiz, setQuizLoading, setQuizError, quizLoading, quizError } = useStore()
  const rounds = useStore((s) => s.rounds)
  const [shareModal, setShareModal] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const shareCardRef = useRef(null)
  const savedRef = useRef(false)
  const confettiPieces = useRef(createConfetti())

  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true
    if (selectedArtist?.id) {
      saveArtistScore(selectedArtist.id, score, totalRounds)
    }
  }, [score, totalRounds, selectedArtist])

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
      const nextRounds = await generateRounds(selectedArtist.name)
      startQuiz(selectedArtist, [], nextRounds)
    } catch (err) {
      setQuizError(err.message)
    }
  }

  if (quizLoading) {
    return <QuizLoading />
  }

  if (quizError) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          padding: 40,
          gap: 16,
          textAlign: 'center',
        }}
      >
        <div style={{ color: 'var(--color-wrong)', fontSize: 15 }}>{quizError}</div>
        <button
          onClick={handlePlayAgain}
          style={{
            padding: '14px 28px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(255,107,53,0.25)',
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 45px rgba(255,107,53,0.45)'; e.currentTarget.style.transform = 'scale(1.03)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(255,107,53,0.25)'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          Try Again
        </button>
        <button
          onClick={newArtist}
          style={{
            padding: '14px 28px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            color: 'var(--color-muted)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)' }}
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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        padding: 'clamp(24px, 5vw, 48px)',
        gap: 20,
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Confetti */}
      {isPerfect && (
        <div aria-hidden="true" style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 50,
        }}>
          {confettiPieces.current.map((p) => (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                top: -10,
                left: `${p.left}%`,
                width: p.size,
                height: p.size * 0.6,
                background: p.color,
                borderRadius: 2,
                animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
                opacity: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* ProfileCard as the main result card */}
      <ProfileCard
        avatarUrl={avatarUrl}
        name={`${score} / ${totalRounds}`}
        title={isPerfect ? 'Perfect!' : pct >= 80 ? 'Great job!' : pct >= 60 ? 'Not bad!' : 'Keep practicing!'}
        handle={artistName}
        status={`${pct}%`}
        contactText={isPerfect ? 'Share Perfect Score!' : 'Share Score'}
        onContactClick={handleOpenShare}
        enableTilt
        enableMobileTilt
        behindGlowEnabled={false}
        behindGlowColor="rgba(255, 107, 53, 0.67)"
        innerGradient="linear-gradient(145deg, #2a1a0e 0%, #FF6B3544 100%)"
        miniAvatarUrl={avatarUrl}
        showUserInfo
      />

      {/* Share section — hidden card for blob generation */}
      {rounds.length > 0 && (
        <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }}>
          <ShareCard
            ref={shareCardRef}
            score={score}
            totalRounds={totalRounds}
            selectedArtist={selectedArtist}
            rounds={rounds}
          />
        </div>
      )}

      {/* Stats */}
      {artistId && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{ width: '100%' }}
        >
          <StatBox artistId={artistId} currentScore={score} currentOutOf={totalRounds} />
        </motion.div>
      )}

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.3 }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          marginTop: 4,
        }}
      >
        <button
          onClick={handlePlayAgain}
          style={{
            padding: '14px 32px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-body)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(255,107,53,0.25)',
            textTransform: 'uppercase',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 45px rgba(255,107,53,0.45)'; e.currentTarget.style.transform = 'scale(1.03)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(255,107,53,0.25)'; e.currentTarget.style.transform = 'scale(1)' }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.97)' }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.03)' }}
        >
          Play Again
        </button>
        <button
          onClick={newArtist}
          style={{
            padding: '14px 32px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            background: 'transparent',
            color: 'var(--color-muted)',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)' }}
        >
          New Artist
        </button>
      </motion.div>

      {/* Share modal */}
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
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'rgba(0,0,0,0.8)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
              padding: 24,
              overflow: 'auto',
            }}
          >
            <motion.div
              initial={{ rotateY: -1080, scale: 1.3, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateY: -360, scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ flexShrink: 0 }}
            >
                <ProfileCard
                  avatarUrl={avatarUrl}
                  name={`${score} / ${totalRounds}`}
                  title={isPerfect ? 'Perfect!' : pct >= 80 ? 'Great job!' : pct >= 60 ? 'Not bad!' : 'Keep practicing!'}
                  handle={artistName}
                  status={`${pct}%`}
                  enableTilt={false}
                  enableMobileTilt={false}
                  behindGlowEnabled={false}
                  innerGradient="linear-gradient(145deg, #2a1a0e 0%, #FF6B3544 100%)"
                  miniAvatarUrl={avatarUrl}
                  showUserInfo={false}
                  branding={true}
                />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.3, duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                gap: 12,
                flexShrink: 0,
              }}
            >
              <ShareButton
                label="WhatsApp"
                color="#25D366"
                onClick={handleWhatsApp}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12a9.98 9.98 0 001.372 5.065L2 22l5.047-1.35A9.98 9.98 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.182c-1.578 0-3.124-.443-4.456-1.277l-.32-.19-3.006.805.804-2.934-.208-.332a8.156 8.156 0 01-1.287-4.472c0-4.514 3.673-8.182 8.182-8.182 4.509 0 8.182 3.668 8.182 8.182 0 4.509-3.673 8.182-8.182 8.182z" fill="#fff"/>
                </svg>
              </ShareButton>
              <ShareButton
                label="Instagram"
                color="#E4405F"
                onClick={handleInstagram}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="#fff" strokeWidth="1.8"/>
                  <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.8"/>
                  <circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/>
                </svg>
              </ShareButton>
              <ShareButton
                label="Download"
                color="rgba(255,255,255,0.08)"
                onClick={() => handleDownload()}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </ShareButton>
              <ShareButton
                label="More"
                color="rgba(255,255,255,0.08)"
                onClick={handleMore}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="5" r="1.5" fill="#fff"/>
                  <circle cx="12" cy="12" r="1.5" fill="#fff"/>
                  <circle cx="12" cy="19" r="1.5" fill="#fff"/>
                </svg>
              </ShareButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
