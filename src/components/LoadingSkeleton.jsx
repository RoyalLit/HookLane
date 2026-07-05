function SkeletonBlock({ width, height, borderRadius }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: borderRadius || 4,
        flexShrink: 0,
        background: 'linear-gradient(90deg, var(--color-surface-hover) 25%, var(--color-surface) 50%, var(--color-surface-hover) 75%)',
        backgroundSize: '200% 100%',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}
    />
  )
}

export function QuizLoading() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100dvh',
        padding: 20,
        gap: 16,
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      <SkeletonBlock width="100%" height={6} borderRadius={3} />
      <SkeletonBlock width={220} height={220} borderRadius={16} />
      <SkeletonBlock width={56} height={56} borderRadius="50%" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          width: '100%',
          maxWidth: 400,
        }}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: 14,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-surface)',
            }}
          >
            <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(90deg, var(--color-surface-hover) 25%, var(--color-surface) 50%, var(--color-surface-hover) 75%)', backgroundSize: '200% 100%', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <SkeletonBlock width="70%" height={12} borderRadius={4} />
          </div>
        ))}
      </div>
    </div>
  )
}
