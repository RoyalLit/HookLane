import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          padding: 40,
          gap: 16,
          textAlign: 'center',
          color: '#fff',
          fontFamily: 'var(--font-body)',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>⚠</div>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ fontSize: 13, color: 'var(--color-muted)', margin: 0 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'var(--font-body)',
              marginTop: 8,
            }}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
