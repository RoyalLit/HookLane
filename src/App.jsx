import { lazy, Suspense } from 'react'
import useStore from './store'
import SearchScreen from './screens/SearchScreen'
import ErrorBoundary from './components/ErrorBoundary'
import ErrorToast from './components/ErrorToast'

const QuizScreen = lazy(() => import('./screens/QuizScreen'))
const ScoreScreen = lazy(() => import('./screens/ScoreScreen'))

export default function App() {
  const screen = useStore((s) => s.screen)
  const toastMessage = useStore((s) => s.toastMessage)
  const clearToast = useStore((s) => s.clearToast)

  function renderScreen() {
    switch (screen) {
      case 'search':
        return <SearchScreen />
      case 'quiz':
        return (
          <ErrorBoundary>
            <Suspense fallback={<div style={{minHeight:'100dvh'}} />}>
              <QuizScreen />
            </Suspense>
          </ErrorBoundary>
        )
      case 'score':
        return (
          <ErrorBoundary>
            <Suspense fallback={<div style={{minHeight:'100dvh'}} />}>
              <ScoreScreen />
            </Suspense>
          </ErrorBoundary>
        )
      default:
        return <SearchScreen />
    }
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <ErrorToast message={toastMessage} onDismiss={clearToast} />
      <main
        id="main-content"
        style={{ animation: 'fadeIn 0.25s ease-out' }}
      >
        {renderScreen()}
      </main>
    </>
  )
}
