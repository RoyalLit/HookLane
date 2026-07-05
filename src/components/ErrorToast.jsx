import { useEffect, useState } from 'react'

const TOAST_DURATION = 5000

export default function ErrorToast({ message, onDismiss }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => handleDismiss(), TOAST_DURATION)
    return () => clearTimeout(timer)
  }, [message])

  function handleDismiss() {
    setExiting(true)
    setTimeout(() => onDismiss?.(), 300)
  }

  if (!message) return null

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        maxWidth: 420,
        width: 'calc(100% - 32px)',
        background: 'var(--color-wrong)',
        color: '#fff',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        fontSize: 14,
        fontWeight: 600,
        lineHeight: 1.5,
        boxShadow: '0 4px 24px rgba(239,68,68,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: 'var(--font-body)',
        animation: exiting ? 'toastOut 0.3s ease-in both' : 'toastIn 0.3s ease-out both',
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#fff',
          fontSize: 18,
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
          opacity: 0.8,
          transition: 'opacity 0.2s',
          minHeight: 44,
          minWidth: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
      >
        ✕
      </button>
    </div>
  )
}
