import { lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'motion/react'
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
      <AnimatePresence mode="wait">
        <motion.main
          key={screen}
          id="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full flex flex-col items-center"
        >
          {renderScreen()}
        </motion.main>
      </AnimatePresence>
    </>
  )
}
