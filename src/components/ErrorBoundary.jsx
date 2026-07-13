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
        <div className="min-h-[100dvh] flex items-center justify-center p-4 bg-[var(--color-bg)]">
          <div className="max-w-md w-full rounded-[var(--radius-lg)] bg-[var(--color-surface)]/90 backdrop-blur-xl border border-[var(--color-border)] p-8 text-center">
            <div className="text-6xl mb-4" role="img" aria-label="Warning">⚠</div>
            <h1 className="font-display font-bold text-xl text-white mb-2">Something went wrong</h1>
            <p className="text-[var(--color-muted)] text-sm mb-6 font-body">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white border-0 cursor-pointer text-sm font-bold font-[var(--font-body)]"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
