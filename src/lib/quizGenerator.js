import { searchTracksByArtist } from './api'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// difficulty: 'easy' | 'medium' | 'hard'
export async function generateRounds(artistName, difficulty = 'medium') {
  let tracks = await searchTracksByArtist(artistName)

  // Deduplicate by id AND by title (iTunes returns same track across albums)
  const seenIds = new Set()
  const seenTitles = new Set()
  const deduped = []
  for (const t of tracks) {
    if (seenIds.has(t.id)) continue
    const key = t.title.toLowerCase()
    if (seenTitles.has(key)) continue
    seenIds.add(t.id)
    seenTitles.add(key)
    deduped.push(t)
  }
  tracks = deduped

  if (tracks.length === 0) {
    throw new Error('No preview-capable tracks found for this artist')
  }

  // Sort by rank descending so tertiles reflect popularity tiers
  tracks.sort((a, b) => b.rank - a.rank)

  const n = tracks.length
  const third = Math.ceil(n / 3)
  const popular = tracks.slice(0, third)
  const mid = tracks.slice(third, third * 2)
  const deep = tracks.slice(third * 2)

  const tertileByTrack = new Map()
  tracks.forEach((t, i) => {
    tertileByTrack.set(t, i < third ? 0 : i < third * 2 ? 1 : 2)
  })

  const TOTAL_ROUNDS = 10

  const pick = (pool, count) => shuffle(pool).slice(0, count)

  // Select question tracks based on difficulty
  let selected = []
  if (difficulty === 'easy') {
    // Top tertile only (biggest hits)
    const available = popular.length >= TOTAL_ROUNDS ? popular : [...popular, ...mid]
    selected = pick(available, TOTAL_ROUNDS)
  } else if (difficulty === 'hard') {
    // Bottom tertile only (deep cuts)
    const available = deep.length >= TOTAL_ROUNDS ? deep : [...deep, ...mid]
    selected = pick(available, TOTAL_ROUNDS)
  } else {
    // Medium: balanced mix like before
    const popularCount = Math.min(2, Math.floor(TOTAL_ROUNDS * 0.2))
    const midCount = Math.min(3, Math.floor(TOTAL_ROUNDS * 0.3))
    const deepCount = TOTAL_ROUNDS - popularCount - midCount
    selected = [
      ...pick(popular, popularCount),
      ...pick(mid, midCount),
      ...pick(deep, deepCount),
    ]
  }

  // Pad if not enough tracks in target tertile
  while (selected.length < TOTAL_ROUNDS && tracks.length > 0) {
    const remaining = tracks.filter(t => !selected.some(s => s.id === t.id))
    if (remaining.length === 0) break
    selected.push(remaining[Math.floor(Math.random() * remaining.length)])
  }

  selected = shuffle(selected)

  const pickDistractors = (correctTrack) => {
    const correctTertile = tertileByTrack.get(correctTrack)
    const byDistance = [[], [], []]

    for (const t of tracks) {
      if (t.id === correctTrack.id) continue
      const distance = Math.abs(tertileByTrack.get(t) - correctTertile)
      byDistance[distance].push(t)
    }

    let ordered
    if (difficulty === 'easy') {
      // Easy: distractors from far tertile (obvious fakes)
      ordered = [
        ...shuffle(byDistance[2]),
        ...shuffle(byDistance[1]),
        ...shuffle(byDistance[0]),
      ]
    } else {
      // Medium & Hard: same-tertile distractors first (harder to distinguish)
      ordered = [
        ...shuffle(byDistance[0]),
        ...shuffle(byDistance[1]),
        ...shuffle(byDistance[2]),
      ]
    }

    const distractors = []
    const seen = new Set()
    for (const t of ordered) {
      if (seen.has(t.id)) continue
      if (t.title.toLowerCase() === correctTrack.title.toLowerCase()) continue
      seen.add(t.id)
      distractors.push(t)
      if (distractors.length === 3) break
    }
    return distractors
  }

  const rounds = selected.map((correctTrack) => {
    const distractors = pickDistractors(correctTrack)
    const options = shuffle([
      { track: correctTrack, isCorrect: true },
      ...distractors.map(t => ({ track: t, isCorrect: false })),
    ])
    return { correctTrack, options }
  })

  return rounds
}
