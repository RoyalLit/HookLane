import { useState, useRef, useEffect, useCallback } from 'react'

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

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const stopAudio = useCallback(() => {
    clearTimer()
    if (!audioRef.current) return
    audioRef.current.onerror = null
    audioRef.current.onended = null
    audioRef.current.oncanplay = null
    audioRef.current.pause()
    audioRef.current.src = ''
    audioRef.current.load()
    audioRef.current = null
  }, [clearTimer])

  const initAudio = useCallback(() => {
    if (audioRef.current) {
      clearTimer()
      return audioRef.current
    }
    const audio = new Audio(previewUrl)
    audio.preload = 'auto'
    audio.volume = 0.5
    audioRef.current = audio
    return audio
  }, [previewUrl, clearTimer])

  const playAudio = useCallback(() => {
    setNeedsGesture(false)
    if (!previewUrl) return
    if (isMaxed) return
    setAudioFailed(false)
    setHasPlayed(false)
    setLoading(true)
    clearTimer()
    const audio = initAudio()
    audio.oncanplay = () => setLoading(false)
    audio.onerror = () => {
      setHasPlayed(false)
      setPlaying(false)
      setLoading(false)
      setAudioFailed(true)
      stopAudio()
    }
    audio.onended = () => {
      setHasPlayed(true)
      setPlaying(false)
      stopAudio()
    }
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
  }, [previewUrl, isMaxed, previewDuration, initAudio, clearTimer, stopAudio])

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
  }, [previewUrl, autoPlay, playAudio])

  useEffect(() => {
    return stopAudio
  }, [stopAudio])

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

  const PlayIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <polygon points="5,3 19,12 5,21" />
    </svg>
  )

  const PauseIcon = (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" />
      <rect x="14" y="4" width="4" height="16" />
    </svg>
  )

  const LoadingIcon = (
    <svg className="animate-spin" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
    </svg>
  )

  const FailedIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )

  const LockedIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )

  const ReplayIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-9-9" />
      <path d="M21 3v5h-5" />
    </svg>
  )

  // Button background and icon color per state
  const isDefault = !loading && !audioFailed && !isMaxed && !hasPlayed && !playing
  const isPlaying = playing && !loading && !audioFailed && !isMaxed
  const isHasPlayed = hasPlayed && !playing && !loading && !audioFailed && !isMaxed

  const buttonBg = loading
    ? 'bg-[var(--color-surface-hover)]'
    : isPlaying || isHasPlayed
    ? 'bg-transparent'
    : 'bg-[var(--color-accent)]'

  const buttonTextColor = isDefault
    ? 'text-white'
    : 'text-[var(--color-accent)]'

  const buttonShadow = isMaxed
    ? 'shadow-[0_0_15px_rgba(255,107,53,0.1)]'
    : 'shadow-[0_0_25px_rgba(255,107,53,0.25)]'

  const buttonCursor = (canPlay || playing) && !loading && !audioFailed ? 'cursor-pointer' : 'cursor-not-allowed'
  const buttonOpacity = !previewUrl ? 'opacity-30' : isMaxed ? 'opacity-45' : audioFailed ? 'opacity-35' : 'opacity-100'

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <button
          onClick={toggle}
          disabled={!previewUrl || (isMaxed && !playing)}
          aria-label={
            isMaxed ? 'No replays remaining' :
            audioFailed ? 'Audio unavailable' :
            playing ? 'Pause' : 'Play preview'
          }
          aria-pressed={playing}
          className={`
            relative flex items-center justify-center rounded-full border-0 transition-all duration-200
            outline-none font-[var(--font-body)] min-w-[64px] min-h-[64px] w-[64px] h-[64px]
            ${buttonBg} ${buttonTextColor} ${buttonShadow} ${buttonCursor} ${buttonOpacity}
            ${canPlay && !loading && !audioFailed && !isMaxed ? 'hover:scale-[1.03] active:scale-[0.97]' : ''}
          `}
        >
          {/* Pulse rings when playing */}
          {playing && !loading && !audioFailed && !isMaxed && (
            <>
              <div className="absolute inset-[-4px] rounded-full border border-[rgba(255,107,53,0.3)] animate-pulse-ring" aria-hidden="true" />
              <div className="absolute inset-[-4px] rounded-full border border-[rgba(255,107,53,0.3)] animate-pulse-ring" style={{ animationDelay: '0.66s' }} aria-hidden="true" />
              <div className="absolute inset-[-4px] rounded-full border border-[rgba(255,107,53,0.3)] animate-pulse-ring" style={{ animationDelay: '1.32s' }} aria-hidden="true" />
            </>
          )}
          {loading ? (
            <svg className="animate-spin" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="31.4 31.4" strokeLinecap="round" />
            </svg>
          ) : audioFailed ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          ) : isMaxed ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          ) : hasPlayed ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-9-9" />
              <path d="M21 3v5h-5" />
            </svg>
          ) : playing ? (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        {/* Outer accent ring - always visible */}
        <div className="absolute inset-[-2px] rounded-full border-2 border-[var(--color-accent)] pointer-events-none" aria-hidden="true" />
      </div>

      {/* Play count indicator for limited modes */}
      {maxPlays !== Infinity && (
        <span className="mt-2 text-[10px] font-semibold tracking-wide font-[var(--font-body)] text-[var(--color-muted)]">
          {isMaxed ? 'no replays' : `${maxPlays - playCount} play${maxPlays - playCount !== 1 ? 's' : ''} left`}
        </span>
      )}

      {showTapLabel && (
        <span className="mt-1.5 text-[11px] text-[var(--color-muted)]">tap to play</span>
      )}
    </div>
  )
}
