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

export function saveArtistScore(artistId, score, outOf) {
  const stats = getArtistStats(artistId)
  stats.plays += 1
  stats.last5.push({ score, outOf })
  if (stats.last5.length > 5) stats.last5.shift()

  const pct = score / outOf
  if (!stats.best || (stats.best.score / stats.best.outOf) < pct) {
    stats.best = { score, outOf }
  }

  try {
    localStorage.setItem(artistKey(artistId), JSON.stringify(stats))
  } catch {
  }
}
