import useStore from './store'
import SearchScreen from './screens/SearchScreen'
import QuizScreen from './screens/QuizScreen'
import ScoreScreen from './screens/ScoreScreen'
import ErrorToast from './components/ErrorToast'

export default function App() {
  const screen = useStore((s) => s.screen)
  const toastMessage = useStore((s) => s.toastMessage)
  const clearToast = useStore((s) => s.clearToast)

  function renderScreen() {
    switch (screen) {
      case 'search':
        return <SearchScreen />
      case 'quiz':
        return <QuizScreen />
      case 'score':
        return <ScoreScreen />
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
        key={screen}
        style={{ animation: 'fadeIn 0.25s ease-out' }}
      >
        {renderScreen()}
      </main>
    </>
  )
}
