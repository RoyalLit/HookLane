import useStore from '../store'
import { generateRounds } from '../lib/quizGenerator'
import { QuizLoading } from '../components/LoadingSkeleton'
import HooklaneHero from '../components/HooklaneHero'
import HowItWorks from '../components/HowItWorks'
import WhyHooklane from '../components/WhyHooklane'
import TrendingNow from '../components/TrendingNow'
import LeaderboardPreview from '../components/LeaderboardPreview'
import Footer from '../components/Footer'
import Grainient from '../components/Grainient'

export default function SearchScreen() {
  const { setQuizLoading, setToast, startQuiz, quizLoading } = useStore()

  const handleSelectArtist = async (artist) => {
    setQuizLoading(true)
    try {
      const rounds = await generateRounds(artist.name)
      if (rounds.length < 1) {
        setQuizLoading(false)
        setToast('No songs found for this artist. Try another.')
        return
      }
      startQuiz(artist, [], rounds)
    } catch (err) {
      setQuizLoading(false)
      setToast(err.message || 'Failed to load tracks. Try another artist.')
    }
  }

  if (quizLoading) {
    return <QuizLoading />
  }

  return (
    <>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 30vh, rgba(0,0,0,0.3) 50vh, rgba(0,0,0,1) 80vh)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 30vh, rgba(0,0,0,0.3) 50vh, rgba(0,0,0,1) 80vh)',
      }}>
        <Grainient
          color1="#FF6B35"
          color2="#4a1f0a"
          color3="#0A0A0B"
          timeSpeed={0.12}
          contrast={0.6}
          saturation={0.4}
          grainAmount={0.02}
          warpStrength={0.3}
          warpFrequency={3}
          blendAngle={25}
          blendSoftness={0.25}
          rotationAmount={250}
          noiseScale={1.2}
          zoom={1.1}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        <HooklaneHero onSelectArtist={handleSelectArtist} />
        <HowItWorks />
        <WhyHooklane />
        <TrendingNow onSelectArtist={handleSelectArtist} />
        <LeaderboardPreview />
        <Footer />
      </div>
    </>
  )
}
