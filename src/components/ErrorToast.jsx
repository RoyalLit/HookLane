import { useEffect, useState, useCallback } from 'react'

const TOAST_DURATION = 5000

export default function ErrorToast({ message, onDismiss }) {
  const [exiting, setExiting] = useState(false)

  const handleDismiss = useCallback(() => {
    setExiting(true)
    setTimeout(() => onDismiss?.(), 300)
  }, [onDismiss])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => handleDismiss(), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [message, handleDismiss])

  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] max-w-[420px] w-[calc(100%-32px)] rounded-[var(--radius-md)] bg-[var(--color-wrong)]/90 backdrop-blur-xl border border-[rgba(239,68,68,0.3)] shadow-[0_8px_32px_rgba(239,68,68,0.25)] p-3 flex items-center gap-3 font-[var(--font-body)] ${exiting ? 'animate-[toastOut_0.3s_ease-in_both]' : 'animate-[toastIn_0.3s_ease-out_both]'} `}
    >
      <svg className="flex-shrink-0 w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span className="flex-1 text-white text-sm font-semibold leading-snug">{message}</span>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        className="p-2 text-white hover:opacity-70 transition-opacity min-h-[44px] min-w-[44px] flex items-center justify-center"
      >
        ✕
      </button>
    </div>
  )
}
