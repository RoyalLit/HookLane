export default function StarBorder({
  as: Component = 'button',
  className = '',
  children,
  color = 'white',
  speed = '6s',
  thickness = 1,
  style: extStyle,
  ...rest
}) {
  return (
    <Component
      className={className}
      {...rest}
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'hidden',
        borderRadius: 20,
        padding: `${thickness}px 0`,
        ...extStyle,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '300%',
          height: '50%',
          opacity: 0.7,
          bottom: -11,
          right: '-250%',
          borderRadius: '50%',
          zIndex: 0,
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `star-movement-bottom ${speed} linear infinite alternate`,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '300%',
          height: '50%',
          opacity: 0.7,
          top: -10,
          left: '-250%',
          borderRadius: '50%',
          zIndex: 0,
          background: `radial-gradient(circle, ${color}, transparent 10%)`,
          animation: `star-movement-top ${speed} linear infinite alternate`,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'linear-gradient(180deg, #000 0%, #171717 100%)',
          border: '1px solid #404040',
          color: '#fff',
          textAlign: 'center',
          fontSize: 16,
          padding: '16px 26px',
          borderRadius: 20,
        }}
      >
        {children}
      </div>
    </Component>
  )
}
