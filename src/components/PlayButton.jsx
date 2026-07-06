import { useState, useRef, useEffect } from 'react'

const PREVIEW_DURATION = 10000

export default function PlayButton({ previewUrl }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [audioFailed, setAudioFailed] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [needsGesture, setNeedsGesture] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    setPlaying(false)
    setAudioFailed(false)
    setHasPlayed(false)
    setLoading(false)
  }, [previewUrl])

  function stopAudio() {
    clearTimer()
    if (!audioRef.current) return
    audioRef.current.onerror = null
    audioRef.current.onended = null
    audioRef.current.oncanplay = null
    audioRef.current.pause()
    audioRef.current.src = ''
    audioRef.current.load()
    audioRef.current = null
  }

  useEffect(() => {
    return stopAudio
  }, [])

  function clearTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  function initAudio() {
    if (audioRef.current) {
      clearTimer()
      return audioRef.current
    }
    const audio = new Audio(previewUrl)
    audio.preload = 'auto'
    audio.volume = 0.5
    audioRef.current = audio
    return audio
  }

  function playAudio() {
    setNeedsGesture(false)
    if (!previewUrl) return
    setAudioFailed(false)
    setHasPlayed(false)
    setLoading(true)
    clearTimer()
    const audio = initAudio()
    audio.oncanplay = () => setLoading(false)
    audio.onerror = () => { setHasPlayed(false); setPlaying(false); setLoading(false); setAudioFailed(true); stopAudio() }
    audio.onended = () => { setHasPlayed(true); setPlaying(false); stopAudio() }
    audio.currentTime = 0
    audio.play().then(() => {
      setPlaying(true)
      setLoading(false)
      timerRef.current = setTimeout(() => {
        stopAudio()
        setPlaying(false)
        setHasPlayed(true)
      }, PREVIEW_DURATION)
    }).catch(() => { setPlaying(false); setLoading(false) })
  }

  function toggle() {
    if (!previewUrl) return
    if (audioRef.current && playing) {
      stopAudio()
      setPlaying(false)
      return
    }
    playAudio()
  }

  const canPlay = !!previewUrl

  const boxShadow = '0 0 25px rgba(255,107,53,0.25)'

  const showTapLabel = !playing && !loading && !audioFailed && needsGesture

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <button
        onClick={toggle}
        disabled={!canPlay}
        aria-label={audioFailed ? 'Audio unavailable' : playing ? 'Pause' : 'Play preview'}
        aria-pressed={playing}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: `2px solid ${audioFailed ? 'var(--color-wrong)' : 'var(--color-accent)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 20,
          cursor: canPlay ? 'pointer' : 'not-allowed',
          opacity: canPlay ? 1 : 0.3,
          transition: 'all 0.2s',
          background: loading ? 'var(--color-surface-hover)' : playing ? 'transparent' : 'var(--color-accent)',
          boxShadow,
          outline: 'none',
          fontFamily: 'var(--font-body)',
          minWidth: 56,
          minHeight: 56,
        }}
      >
        {loading ? (
          <div
            style={{
              width: 18,
              height: 18,
              border: '2px solid var(--color-muted)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
        ) : audioFailed ? (
          <span style={{ fontSize: 16, fontWeight: 700 }}>!</span>
        ) : hasPlayed ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12a9 9 0 1 1-9-9" />
            <path d="M21 3v5h-5" />
          </svg>
        ) : playing ? (
          <span style={{ fontSize: 16 }}>⏸</span>
        ) : (
          <span style={{ fontSize: 16, marginLeft: 2 }}>▶</span>
        )}
      </button>
      {showTapLabel && (
        <span style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 6 }}>tap to play</span>
      )}
    </div>
  )
}
