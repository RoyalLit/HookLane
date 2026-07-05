import FadeIn from './ui/FadeIn'

export default function Footer() {
  return (
    <footer style={{
      padding: '48px 16px',
      background: 'rgba(10,10,11,0.2)',
      WebkitBackdropFilter: 'blur(12px)',
      backdropFilter: 'blur(12px)',
    }}>
      <FadeIn scale>
        <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: '#FF6B35' }}>Hook</span><span style={{ color: '#fff' }}>lane</span>
          </span>
          <p style={{ color: 'rgba(200,198,203,0.6)', fontSize: 12, fontFamily: 'var(--font-body)' }}>
            Music quiz for real fans.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontSize: 12,
          color: 'rgba(200,198,203,0.6)',
          fontFamily: 'var(--font-body)',
        }}>
          <span>Powered by Deezer</span>
          <a
            href="https://github.com/pahul"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(200,198,203,0.6)',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(200,198,203,0.6)'}
          >
            GitHub
          </a>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
      </FadeIn>
    </footer>
  )
}
