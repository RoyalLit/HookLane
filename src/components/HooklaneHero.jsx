import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import GradientText from './ui/GradientText'
import ShinyText from './ui/ShinyText'
import StarBorder from './ui/StarBorder'
import FadeIn from './ui/FadeIn'
import useStore from '../store'
import { searchArtists } from '../lib/api'

const accent = 'var(--color-accent)'
const muted = 'var(--color-muted)'
const surface = 'var(--color-surface)'
const surfaceHover = 'var(--color-surface-hover)'
const border = 'var(--color-border)'

const RECORD_COLORS = [
  '#1a1a2e', '#16213e', '#0f3460', '#533483',
  '#2d1b69', '#1e3a5f', '#4a1942', '#1a2f3a',
  '#3d1f3a', '#1f3d3d',
]

const ALBUM_ARTS = [
  // Interleaved: international + Indian/Punjabi mixed
  'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/db/22/4e/db224ee0-b058-5d06-9a8c-fa10662bd58e/18UMGIM17205.rgb.jpg/600x600bb.jpg', // The Weeknd
  'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d2/89/ac/d289ac98-749e-3822-6b6e-b06aa4815715/859740651597_cover.jpg/600x600bb.jpg', // Diljit Dosanjh
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/eb/e6/06/ebe606da-e00f-82d3-47f3-b79904eed541/17UM1IM24651.rgb.jpg/600x600bb.jpg', // Taylor Swift
  'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d3/08/bc/d308bc6a-20e1-6532-d933-35d1b429210e/5054197755538.jpg/600x600bb.jpg', // Karan Aujla
  'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e7/49/8f/e7498f65-df8f-bead-d6e3-2a8d4d642a79/886447235317.jpg/600x600bb.jpg', // Travis Scott
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/01/6c/0b/016c0b7d-46c3-5c63-a124-278e42e2dc30/26UMGIM14087.rgb.jpg/600x600bb.jpg', // AP Dhillon
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/92/9f/69/929f69f1-9977-3a44-d674-11f70c852d1b/24UMGIM36186.rgb.jpg/600x600bb.jpg', // Billie Eilish
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4a/aa/11/4aaa112c-0264-4e79-361b-1aec3b9bea3f/5063960816505_cover.jpg/600x600bb.jpg', // Sidhu Moose Wala
  'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/95/f5/87/95f587f7-21c3-d5f9-d81a-4350f9caa020/16UMGIM27643.rgb.jpg/600x600bb.jpg', // Drake
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/87/78/db/8778db0e-988f-74d5-b217-3e898a51625d/886446897370.jpg/600x600bb.jpg', // Badshah
  'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/15/e6/e8/15e6e8a4-4190-6a8b-86c3-ab4a51b88288/190295851286.jpg/600x600bb.jpg', // Ed Sheeran
  'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/2d/11/b9/2d11b994-b4fa-19eb-953d-70b472165e95/8903431566911_cover.jpg/600x600bb.jpg', // Arijit Singh
  'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/78/07/35/78073533-a113-170d-bfab-acc3cec405d1/00602567238218.rgb.jpg/600x600bb.jpg', // Eminem
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/8c/3c/10/8c3c1016-be7e-666c-225d-00b671fb38e0/199066150108.jpg/600x600bb.jpg', // Seedhe Maut
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/ed/46/bf/ed46bf4e-7cb9-965a-54f3-03059977fe6c/075679589293.jpg/600x600bb.jpg', // Bruno Mars
  'https://is1-ssl.mzstatic.com/image/thumb/Music128/v4/50/6b/35/506b356b-41d5-0f39-2a30-08a6a28d85bf/8903431687487_cover.jpg/600x600bb.jpg', // Atif Aslam
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/f5/93/8c/f5938c49-964c-31d1-4b33-78b634f71fb7/190295978075.jpg/600x600bb.jpg', // Coldplay
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/55/36/4f/55364f82-ce0b-eff7-83ee-e8542ca4c119/8903431148698_cover.jpg/600x600bb.jpg', // AR Rahman
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/0e/c1/57/0ec1575f-5153-ac4b-d578-c5fa3a90bfe1/5021732511676.jpg/600x600bb.jpg', // Dua Lipa
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/96/7b/00/967b0079-bdae-3248-1450-c289a8b329e2/VEATP-44197.jpg/600x600bb.jpg', // DIVINE
  'https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/31/57/de/3157dec9-5e26-40d1-d61c-bce30558752d/16UMGIM76041.rgb.jpg/600x600bb.jpg', // Post Malone
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/33/73/63/337363a3-083c-6fef-59f8-6b33be5487af/8909024024585.png/600x600bb.jpg', // Shreya Ghoshal
  'https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/21/fd/d3/21fdd3d4-0c00-53ef-3903-d0569c49a812/19UMGIM89397.rgb.jpg/600x600bb.jpg', // Kanye West
  'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/a2/bc/ad/a2bcad46-b389-4be1-8bac-5a0959b0b8e4/886446548449.jpg/600x600bb.jpg', // SZA
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/69/9c/b5/699cb5d6-115c-ff73-9d26-e57ea4350d72/887828031795.png/600x600bb.jpg', // Arctic Monkeys
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/77/32/74/7732746d-25e5-baae-b921-bad4a07d87b1/19UMGIM55524.rgb.jpg/600x600bb.jpg', // Bad Bunny
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/3e/17/ec/3e17ec6d-f980-c64f-19e0-a6fd8bbf0c10/886445635850.jpg/600x600bb.jpg', // Pink Floyd
  'https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/94/28/36/94283609-93bb-db1c-e997-44e82c157e90/00602567261216.rgb.jpg/600x600bb.jpg', // Kendrick Lamar
]

function generateVinyls(isMobile) {
  if (isMobile) {
    // Mobile: fewer, smaller, spread out to avoid clutter
    const fg = [
      { left: '-12%', top: '-2%', size: 200, delay: 0, zIndex: 2, opacity: 0.7, blur: 0 },
      { left: 'auto', right: '-10%', top: '6%', size: 170, delay: 0.4, zIndex: 2, opacity: 0.65, blur: 0 },
      { left: '-14%', top: '44%', size: 210, delay: 0.8, zIndex: 2, opacity: 0.72, blur: 0 },
      { left: 'auto', right: '-12%', top: '50%', size: 180, delay: 1.2, zIndex: 2, opacity: 0.68, blur: 0 },
      { left: '-10%', top: '80%', size: 160, delay: 1.6, zIndex: 2, opacity: 0.6, blur: 0 },
      { left: 'auto', right: '-14%', top: '84%', size: 170, delay: 2.0, zIndex: 2, opacity: 0.65, blur: 0 },
    ]
    const far = [
      { left: '-18%', top: '18%', size: 90, delay: 0.2, zIndex: 0, opacity: 0.08, blur: 5 },
      { left: 'auto', right: '-16%', top: '24%', size: 85, delay: 0.6, zIndex: 0, opacity: 0.07, blur: 5 },
      { left: '25%', top: '10%', size: 70, delay: 0.4, zIndex: 0, opacity: 0.06, blur: 6 },
      { left: 'auto', right: '20%', top: '38%', size: 75, delay: 1.0, zIndex: 0, opacity: 0.06, blur: 5 },
      { left: '10%', top: '30%', size: 60, delay: 0.8, zIndex: 0, opacity: 0.05, blur: 6 },
      { left: 'auto', right: '10%', top: '68%', size: 65, delay: 1.4, zIndex: 0, opacity: 0.06, blur: 5 },
      { left: '-20%', top: '60%', size: 80, delay: 1.0, zIndex: 0, opacity: 0.07, blur: 5 },
      { left: 'auto', right: '-20%', top: '74%', size: 75, delay: 1.8, zIndex: 0, opacity: 0.06, blur: 5 },
      { left: '40%', top: '20%', size: 55, delay: 0.5, zIndex: 0, opacity: 0.04, blur: 6 },
      { left: '30%', top: '50%', size: 50, delay: 0.9, zIndex: 0, opacity: 0.04, blur: 7 },
      { left: '50%', top: '72%', size: 60, delay: 0.7, zIndex: 0, opacity: 0.05, blur: 6 },
      { left: '35%', top: '85%', size: 55, delay: 1.3, zIndex: 0, opacity: 0.04, blur: 7 },
      { left: 'auto', right: '-22%', top: '90%', size: 70, delay: 0.3, zIndex: 0, opacity: 0.06, blur: 5 },
      { left: '-22%', top: '90%', size: 65, delay: 0.7, zIndex: 0, opacity: 0.05, blur: 6 },
    ]
    return [...fg, ...far]
  }

  // Desktop: full spread with depth layers
  const fg = [
    { left: '-6%', top: '-3%', size: 360, delay: 0, zIndex: 2, opacity: 0.88, blur: 0 },
    { left: 'auto', right: '-5%', top: '2%', size: 310, delay: 0.4, zIndex: 2, opacity: 0.82, blur: 0 },
    { left: '-8%', top: '38%', size: 380, delay: 0.8, zIndex: 2, opacity: 0.9, blur: 0 },
    { left: 'auto', right: '-7%', top: '44%', size: 330, delay: 1.2, zIndex: 2, opacity: 0.85, blur: 0 },
    { left: '-5%', top: '76%', size: 290, delay: 1.6, zIndex: 2, opacity: 0.8, blur: 0 },
    { left: 'auto', right: '-8%', top: '80%', size: 300, delay: 2.0, zIndex: 2, opacity: 0.85, blur: 0 },
    { left: '22%', top: '-6%', size: 240, delay: 0.2, zIndex: 2, opacity: 0.75, blur: 0 },
    { left: 'auto', right: '18%', top: '92%', size: 260, delay: 1.4, zIndex: 2, opacity: 0.78, blur: 0 },
    { left: '38%', top: '92%', size: 220, delay: 0.6, zIndex: 2, opacity: 0.7, blur: 0 },
    { left: 'auto', right: '25%', top: '-4%', size: 200, delay: 1.0, zIndex: 2, opacity: 0.72, blur: 0 },
  ]
  const near = [
    { left: '-4%', top: '15%', size: 230, delay: 0.1, zIndex: 1, opacity: 0.35, blur: 0 },
    { left: 'auto', right: '-3%', top: '18%', size: 200, delay: 0.5, zIndex: 1, opacity: 0.32, blur: 0 },
    { left: '15%', top: '32%', size: 150, delay: 0.3, zIndex: 1, opacity: 0.25, blur: 0 },
    { left: 'auto', right: '12%', top: '30%', size: 170, delay: 0.7, zIndex: 1, opacity: 0.28, blur: 0 },
    { left: '-3%', top: '60%', size: 220, delay: 0.9, zIndex: 1, opacity: 0.3, blur: 0 },
    { left: 'auto', right: '-2%', top: '64%', size: 190, delay: 1.1, zIndex: 1, opacity: 0.33, blur: 0 },
    { left: '28%', top: '82%', size: 160, delay: 1.3, zIndex: 1, opacity: 0.22, blur: 0 },
    { left: 'auto', right: '25%', top: '10%', size: 140, delay: 0.6, zIndex: 1, opacity: 0.2, blur: 0 },
    { left: '8%', top: '48%', size: 130, delay: 0.4, zIndex: 1, opacity: 0.18, blur: 0 },
    { left: 'auto', right: '6%', top: '52%', size: 120, delay: 0.8, zIndex: 1, opacity: 0.2, blur: 0 },
    { left: '45%', top: '18%', size: 110, delay: 0.2, zIndex: 1, opacity: 0.15, blur: 0 },
    { left: 'auto', right: '30%', top: '75%', size: 130, delay: 1.0, zIndex: 1, opacity: 0.18, blur: 0 },
  ]
  const mid = [
    { left: '-12%', top: '8%', size: 150, delay: 0.2, zIndex: 0, opacity: 0.12, blur: 3 },
    { left: 'auto', right: '-10%', top: '24%', size: 140, delay: 0.6, zIndex: 0, opacity: 0.1, blur: 3 },
    { left: '20%', top: '-8%', size: 120, delay: 0.4, zIndex: 0, opacity: 0.11, blur: 4 },
    { left: 'auto', right: '20%', top: '42%', size: 130, delay: 1.0, zIndex: 0, opacity: 0.1, blur: 3 },
    { left: '40%', top: '28%', size: 110, delay: 0.8, zIndex: 0, opacity: 0.09, blur: 4 },
    { left: 'auto', right: '35%', top: '56%', size: 125, delay: 1.4, zIndex: 0, opacity: 0.12, blur: 3 },
    { left: '-14%', top: '70%', size: 130, delay: 1.0, zIndex: 0, opacity: 0.1, blur: 4 },
    { left: 'auto', right: '-12%', top: '76%', size: 120, delay: 1.8, zIndex: 0, opacity: 0.09, blur: 3 },
    { left: '55%', top: '10%', size: 100, delay: 0.5, zIndex: 0, opacity: 0.08, blur: 4 },
    { left: '10%', top: '20%', size: 90, delay: 0.9, zIndex: 0, opacity: 0.1, blur: 3 },
    { left: 'auto', right: '10%', top: '90%', size: 110, delay: 1.3, zIndex: 0, opacity: 0.09, blur: 4 },
    { left: '48%', top: '68%', size: 95, delay: 0.7, zIndex: 0, opacity: 0.08, blur: 4 },
    { left: '65%', top: '35%', size: 85, delay: 0.3, zIndex: 0, opacity: 0.07, blur: 4 },
    { left: 'auto', right: '15%', top: '14%', size: 90, delay: 1.1, zIndex: 0, opacity: 0.08, blur: 3 },
  ]
  const far = [
    { left: '-18%', top: '1%', size: 85, delay: 0.15, zIndex: 0, opacity: 0.05, blur: 8 },
    { left: 'auto', right: '-16%', top: '2%', size: 80, delay: 0.45, zIndex: 0, opacity: 0.04, blur: 8 },
    { left: '5%', top: '5%', size: 70, delay: 0.75, zIndex: 0, opacity: 0.04, blur: 9 },
    { left: 'auto', right: '5%', top: '7%', size: 65, delay: 1.05, zIndex: 0, opacity: 0.05, blur: 9 },
    { left: '35%', top: '2%', size: 60, delay: 0.35, zIndex: 0, opacity: 0.03, blur: 10 },
    { left: '60%', top: '4%', size: 55, delay: 0.65, zIndex: 0, opacity: 0.04, blur: 10 },
    { left: '-22%', top: '17%', size: 70, delay: 0.95, zIndex: 0, opacity: 0.03, blur: 9 },
    { left: 'auto', right: '-20%', top: '15%', size: 65, delay: 1.25, zIndex: 0, opacity: 0.04, blur: 10 },
    { left: '25%', top: '19%', size: 55, delay: 0.55, zIndex: 0, opacity: 0.03, blur: 11 },
    { left: 'auto', right: '25%', top: '21%', size: 50, delay: 0.85, zIndex: 0, opacity: 0.03, blur: 11 },
    { left: '70%', top: '16%', size: 60, delay: 1.15, zIndex: 0, opacity: 0.04, blur: 10 },
    { left: 'auto', right: '30%', top: '24%', size: 55, delay: 1.45, zIndex: 0, opacity: 0.03, blur: 11 },
    { left: '45%', top: '38%', size: 50, delay: 0.25, zIndex: 0, opacity: 0.04, blur: 12 },
    { left: 'auto', right: '40%', top: '34%', size: 45, delay: 0.55, zIndex: 0, opacity: 0.03, blur: 12 },
    { left: '-24%', top: '28%', size: 55, delay: 0.85, zIndex: 0, opacity: 0.03, blur: 10 },
    { left: 'auto', right: '-22%', top: '36%', size: 60, delay: 1.15, zIndex: 0, opacity: 0.04, blur: 10 },
    { left: '15%', top: '42%', size: 50, delay: 0.65, zIndex: 0, opacity: 0.03, blur: 11 },
    { left: 'auto', right: '15%', top: '46%', size: 55, delay: 0.95, zIndex: 0, opacity: 0.04, blur: 11 },
    { left: '65%', top: '48%', size: 60, delay: 1.25, zIndex: 0, opacity: 0.03, blur: 10 },
    { left: 'auto', right: '20%', top: '54%', size: 65, delay: 1.55, zIndex: 0, opacity: 0.04, blur: 9 },
    { left: '-16%', top: '53%', size: 75, delay: 0.4, zIndex: 0, opacity: 0.05, blur: 8 },
    { left: 'auto', right: '-18%', top: '58%', size: 70, delay: 0.7, zIndex: 0, opacity: 0.04, blur: 9 },
    { left: '30%', top: '63%', size: 55, delay: 1.0, zIndex: 0, opacity: 0.05, blur: 8 },
    { left: 'auto', right: '30%', top: '68%', size: 50, delay: 1.3, zIndex: 0, opacity: 0.04, blur: 9 },
    { left: '50%', top: '78%', size: 60, delay: 0.3, zIndex: 0, opacity: 0.03, blur: 10 },
    { left: 'auto', right: '5%', top: '72%', size: 55, delay: 0.6, zIndex: 0, opacity: 0.04, blur: 10 },
    { left: '5%', top: '82%', size: 50, delay: 0.9, zIndex: 0, opacity: 0.03, blur: 11 },
    { left: 'auto', right: '35%', top: '80%', size: 45, delay: 1.2, zIndex: 0, opacity: 0.03, blur: 11 },
    { left: '-20%', top: '86%', size: 70, delay: 0.5, zIndex: 0, opacity: 0.04, blur: 9 },
    { left: 'auto', right: '-24%', top: '90%', size: 75, delay: 0.8, zIndex: 0, opacity: 0.05, blur: 8 },
    { left: '75%', top: '88%', size: 55, delay: 1.1, zIndex: 0, opacity: 0.03, blur: 10 },
    { left: 'auto', right: '8%', top: '94%', size: 50, delay: 1.4, zIndex: 0, opacity: 0.04, blur: 10 },
    { left: '-26%', top: '-5%', size: 90, delay: 0.2, zIndex: 0, opacity: 0.05, blur: 8 },
    { left: 'auto', right: '-24%', top: '-4%', size: 85, delay: 0.7, zIndex: 0, opacity: 0.04, blur: 9 },
    { left: '80%', top: '38%', size: 55, delay: 0.4, zIndex: 0, opacity: 0.03, blur: 11 },
    { left: 'auto', right: '45%', top: '14%', size: 50, delay: 0.9, zIndex: 0, opacity: 0.03, blur: 11 },
    { left: '55%', top: '55%', size: 50, delay: 0.6, zIndex: 0, opacity: 0.04, blur: 9 },
    { left: 'auto', right: '38%', top: '62%', size: 55, delay: 1.0, zIndex: 0, opacity: 0.03, blur: 10 },
  ]
  return [...fg, ...near, ...mid, ...far]
}

export default function HooklaneHero({ onSelectArtist }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { setToast } = useStore()
  const searchInputRef = useRef(null)
  const abortRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)

    const resizeHandler = () => setIsMobile(window.innerWidth <= 768)
    resizeHandler()
    window.addEventListener('resize', resizeHandler)

    return () => {
      mq.removeEventListener('change', handler)
      window.removeEventListener('resize', resizeHandler)
    }
  }, [])

  // Auto-search on typing with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    abortRef.current?.abort()
    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }
    setSearching(true)
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const data = await searchArtists(query.trim(), { signal: controller.signal })
        if (!controller.signal.aborted) {
          setResults(data || [])
          setSearched(true)
        }
      } catch (e) {
        if (e.name !== 'AbortError') setToast('Search failed. Check connection.')
      } finally {
        if (!abortRef.current?.signal.aborted) setSearching(false)
      }
    }, 300)
  }, [query])

  function handlePlayNow() {
    searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => searchInputRef.current?.focus(), 350)
  }

  function handleSignIn() {
    setToast('Sign in coming soon — play as a guest for now!')
  }

  function handleSelect(artist) {
    setQuery('')
    setResults([])
    setSearched(false)
    onSelectArtist(artist)
  }

  const vinyls = generateVinyls(isMobile)

  return (
    <section
      aria-label="Hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 16px',
        background: 'transparent',
      }}
    >
      {/* Bottom fade overlay — replaces overflow:hidden + maskImage on the section
          which was causing a scroll trap (composited layer exit delay) */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '20%',
          background: 'linear-gradient(to bottom, transparent, var(--color-bg, #0A0A0B))',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
      {/* Vinyl records */}
      {vinyls.map((v, i) => {
        const floatIndex = (i % 6) + 1
        const posStyle = {}
        if (v.left !== undefined) posStyle.left = v.left
        if (v.right !== undefined) posStyle.right = v.right
        return (
          <div
            key={i}
            aria-hidden="true"
            style={{
              position: 'absolute',
              ...posStyle,
              top: v.top,
              width: v.size,
              height: v.size,
              zIndex: v.zIndex,
              pointerEvents: 'none',
              animation: reducedMotion
                ? 'none'
                : `vinylFloat${floatIndex} ${5 + (i % 6) * 0.4}s ease-in-out infinite`,
              opacity: v.opacity,
              filter: v.blur > 0 ? `blur(${v.blur}px)` : 'none',
              transform: v.blur > 0 ? 'translateZ(0)' : 'none',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: v.blur > 0
                  ? `radial-gradient(circle, ${RECORD_COLORS[i % RECORD_COLORS.length]} 0%, #111 40%, #0a0a0a 70%, #1a1a1a 100%)`
                  : `radial-gradient(circle, #111 30%, #0a0a0a 60%, #1a1a1a 100%)`,
                border: 'none',
                boxShadow: v.opacity > 0.5 ? '0 0 60px rgba(255,107,53,0.12), 0 8px 32px rgba(0,0,0,0.4)' : v.blur === 0 ? '0 0 30px rgba(255,107,53,0.06)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: reducedMotion ? 'none' : 'vinylSpin 8s linear infinite',
              }}
            >
              {v.blur === 0 && (
                <div
                  style={{
                    width: '40%',
                    height: '40%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: v.opacity > 0.5 ? 'inset 0 0 0 2px rgba(255,107,53,0.3)' : 'inset 0 0 0 1px rgba(255,107,53,0.15)',
                  }}
                >
                  <img
                    src={ALBUM_ARTS[i % ALBUM_ARTS.length]}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
            </div>
          </div>
        )
      })}

      {/* Gradient orbs */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #FF6B35 0%, transparent 50%), radial-gradient(circle at 75% 75%, #FF6B35 0%, transparent 50%)',
        }}
      />

      {/* Nav */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(12px, 3vw, 24px)',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
          <span style={{ color: accent }}>Hook</span>
          <span style={{ color: '#fff' }}>lane</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <motion.button
            onClick={handleSignIn}
            whileHover={{ scale: 1.05, color: '#fff' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'transparent',
              border: 'none',
              color: muted,
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              padding: '8px 4px',
              minHeight: 44,
            }}
          >
            Sign In
          </motion.button>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-flex' }}
          >
            <StarBorder
              as="button"
              onClick={handlePlayNow}
              color="#FF6B35"
              speed="8s"
              thickness={1}
              style={{ fontSize: 14 }}
            >
              Play Now
            </StarBorder>
          </motion.div>
        </div>
      </nav>

      {/* Hero content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 600,
          width: '100%',
        }}
      >
        <FadeIn delay={0.1}>
          <GradientText
            as="h1"
            from="#FF6B35"
            via="#FFB59D"
            to="#FF6B35"
            style={{
              fontSize: 'clamp(48px, 10vw, 96px)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              marginBottom: 16,
              lineHeight: 1.1,
            }}
          >
            HOOKLANE
          </GradientText>
        </FadeIn>

        <FadeIn delay={0.25}>
          <p
            style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              color: muted,
              marginBottom: 32,
              maxWidth: 400,
              lineHeight: 1.6,
            }}
          >
            Search your favorite artist. Listen to 10-second clips.{' '}
            <ShinyText speed={6}>Guess the song.</ShinyText> Prove your fandom.
          </p>
        </FadeIn>

        <FadeIn delay={0.4} style={{ width: '100%', maxWidth: 480 }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(26,26,30,0.6)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: '12px 16px',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255,107,53,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg
                style={{ width: 20, height: 20, color: muted, flexShrink: 0 }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search any artist..."
                aria-label="Search for an artist"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: 16,
                  fontFamily: 'var(--font-mono)',
                  outline: 'none',
                }}
              />
              {searching && (
                <div
                  style={{
                    width: 20,
                    height: 20,
                    border: '2px solid var(--color-accent)',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                    flexShrink: 0,
                  }}
                />
              )}
            </div>

            {searched && !searching && results.length === 0 && (
              <p style={{ color: muted, fontSize: 14, marginTop: 12, textAlign: 'center' }}>
                No artists found. Try a different search.
              </p>
            )}

            {results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 8,
                  background: surface,
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                }}
              >
                {results.slice(0, 5).map((artist, idx) => (
                  <motion.button
                    key={artist.id}
                    onClick={() => handleSelect(artist)}
                    whileHover={{ background: surfaceHover }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      display: 'flex',
                      width: '100%',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 14,
                      color: '#fff',
                      background: 'transparent',
                      border: 'none',
                      borderTop: idx > 0 ? '1px solid var(--color-border)' : 'none',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      minHeight: 44,
                    }}
                  >
                    {artist.picture_small ? (
                      <img
                        src={artist.picture_small}
                        alt=""
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: surfaceHover,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: muted,
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        ?
                      </div>
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                        {artist.name}
                      </p>
                      {artist.nb_fan && (
                        <p style={{ color: muted, fontSize: 12, margin: 0 }}>
                          {artist.nb_fan.toLocaleString()} fans
                        </p>
                      )}
                    </div>
                    <svg
                      style={{ width: 16, height: 16, color: muted, flexShrink: 0 }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    </motion.button>
                ))}
              </motion.div>
            )}
          </div>
        </FadeIn>

        {!searched && (
          <FadeIn delay={0.55}>
            <p style={{ color: 'rgba(200,198,203,0.6)', fontSize: 12, marginTop: 24 }}>
              No signup needed. Search any artist to start.
            </p>
          </FadeIn>
        )}
      </div>



      {/* Scroll hint */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: reducedMotion ? 'none' : 'heroBounce 2.5s ease-in-out infinite',
        }}
      >
        <svg
          style={{ width: 20, height: 20, color: 'rgba(200,198,203,0.4)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
