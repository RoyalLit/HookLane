export default function ShinyText({
  children,
  disabled = false,
  speed = 5,
  className = '',
  style: extStyle,
}) {
  const animStyle = disabled
    ? { animation: 'none' }
    : { animation: `shimmer ${speed}s linear infinite` }
  return (
    <span
      className={`inline-block relative ${className}`}
      style={{
        ...extStyle,
        backgroundImage:
          'linear-gradient(120deg, rgba(255,255,255,1) 30%, rgba(255,255,255,1) 40%, rgba(255,200,150,1) 50%, rgba(255,255,255,1) 60%, rgba(255,255,255,1) 70%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'white',
        ...animStyle,
      }}
    >
      {children}
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
    </span>
  )
}
