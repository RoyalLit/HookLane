import { useState, useRef, useEffect } from 'react'

const DEFAULT_PREVIEW_DURATION = 10000

export default function PlayButton({ previewUrl, autoPlay, maxPlays = Infinity, clipDuration }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [audioFailed, setAudioFailed] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [needsGesture, setNeedsGesture] = useState(true)
  const [playCount, setPlayCount] = useState(0)
  const timerRef = useRef(null)

  const previewDuration = clipDuration ? clipDuration * 1000 : DEFAULT_PREVIEW_DURATION
  const isMaxed = maxPlays !== Infinity && playCount >= maxPlays

  useEffect(() => {
    setPlaying(false)
    setAudioFailed(false)
    setHasPlayed(false)
    setLoading(false)
    setPlayCount(0)

    if (autoPlay && previewUrl) {
      const t = setTimeout(() => {
        playAudio()
      }, 400)
      return () => clearTimeout(t)
    }
  }, [previewUrl, autoPlay])

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
    if (isMaxed) return
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
      setPlayCount(c => c + 1)
      timerRef.current = setTimeout(() => {
        stopAudio()
        setPlaying(false)
        setHasPlayed(true)
      }, previewDuration)
    }).catch(() => { setPlaying(false); setLoading(false) })
  }

  function toggle() {
    if (!previewUrl) return
    if (audioRef.current && playing) {
      stopAudio()
      setPlaying(false)
      return
    }
    if (isMaxed) return
    playAudio()
  }

  const canPlay = !!previewUrl && !isMaxed
  const showTapLabel = !playing && !loading && !audioFailed && needsGesture && !isMaxed

  let buttonClasses = 'relative z-10 w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl transition-all duration-200 outline-none font-body min-w-[56px] min-h-[56px]'
  
  if (audioFailed) {
    buttonClasses += ' border-[var(--color-wrong)] bg-[var(--color-accent)] text-white'
  } else if (isMaxed) {
    buttonClasses += ' border-[var(--color-border)] bg-transparent text-[var(--color-muted)] opacity-45 shadow-[0_0_15px_rgba(255,107,53,0.1)] cursor-not-allowed'
  } else {
    buttonClasses += ' border-[var(--color-accent)] text-white cursor-pointer shadow-[0_0_25px_rgba(255,107,53,0.25)]'
    if (loading) {
      buttonClasses += ' bg-[var(--color-surface-hover)]'
    } else if (playing) {
      buttonClasses += ' bg-transparent shadow-[0_0_35px_rgba(255,107,53,0.4)]'
    } else {
      buttonClasses += ' bg-[var(--color-accent)]'
    }
  }

  if (!previewUrl) {
    buttonClasses += ' opacity-30 cursor-not-allowed'
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        {/* Expanding concentric pulsing rings when playing */}
        {playing && (
          <>
            <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-[var(--color-accent)] animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-50 z-0" />
            <div className="absolute top-0 left-0 w-14 h-14 rounded-full border-2 border-[var(--color-accent)] animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s] opacity-30 z-0" />
          </>
        )}

        <button
          onClick={toggle}
          disabled={!previewUrl || (isMaxed && !playing)}
          aria-label={
            isMaxed ? 'No replays remaining' :
            audioFailed ? 'Audio unavailable' :
            playing ? 'Pause' : 'Play preview'
          }
          aria-pressed={playing}
          className={buttonClasses}
        >
          {loading ? (
            <div className="w-4.5 h-4.5 border-2 border-[var(--color-muted)] border-t-white rounded-full animate-spin" />
          ) : audioFailed ? (
            <span className="text-base font-bold">!</span>
          ) : isMaxed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          ) : hasPlayed ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-9-9" />
              <path d="M21 3v5h-5" />
            </svg>
          ) : playing ? (
            <span className="text-base">⏸</span>
          ) : (
            <span className="text-base ml-0.5">▶</span>
          )}
        </button>
      </div>

      {maxPlays !== Infinity && (
        <span className={`text-[10px] mt-1.5 font-semibold tracking-wide font-body ${isMaxed ? 'text-[var(--color-wrong)]' : 'text-[var(--color-muted)]'}`}>
          {isMaxed ? 'no replays' : `${maxPlays - playCount} play${maxPlays - playCount !== 1 ? 's' : ''} left`}
        </span>
      )}

      {showTapLabel && (
        <span className="text-[11px] text-[var(--color-muted)] mt-1.5 font-body">tap to play</span>
      )}
    </div>
  )
}
