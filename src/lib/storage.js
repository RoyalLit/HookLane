const KEY_PREFIX = 'hooklane_'

function artistKey(artistId) {
  return `${KEY_PREFIX}artist_${artistId}`
}

function defaultStats() {
  return { best: null, plays: 0, last5: [] }
}

export function getArtistStats(artistId) {
  try {
    const raw = localStorage.getItem(artistKey(artistId))
    return raw ? JSON.parse(raw) : defaultStats()
  } catch {
    return defaultStats()
  }
}

export function saveArtistScore(artistId, score, outOf, difficulty = 'medium') {
  const stats = getArtistStats(artistId)
  stats.plays += 1
  stats.last5.push({ score, outOf, difficulty })
  if (stats.last5.length > 5) stats.last5.shift()

  const pct = score / outOf
  const bestPct = stats.best ? stats.best.score / stats.best.outOf : -1
  // Prefer higher score; on tie prefer harder difficulty
  const diffRank = { easy: 0, medium: 1, hard: 2 }
  const newDiffRank = diffRank[difficulty] ?? 1
  const bestDiffRank = diffRank[stats.best?.difficulty] ?? 1
  const isBetter = pct > bestPct || (pct === bestPct && newDiffRank > bestDiffRank)

  if (!stats.best || isBetter) {
    stats.best = { score, outOf, difficulty }
  }

  try {
    localStorage.setItem(artistKey(artistId), JSON.stringify(stats))
  } catch {
  }
}

