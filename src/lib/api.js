const DEEZER = '/api/deezer'
const ITUNES = '/api/itunes'

export async function searchArtists(query, { signal } = {}) {
  const res = await fetch(`${DEEZER}/search/artist?q=${encodeURIComponent(query)}`, { signal })
  if (!res.ok) throw new Error(`Search failed: ${res.status}`)
  const data = await res.json()
  const artists = data.data || []
  const seen = new Map()
  for (const a of artists) {
    const key = a.name.toLowerCase()
    const existing = seen.get(key)
    if (!existing || (a.nb_fan || 0) > (existing.nb_fan || 0)) {
      seen.set(key, a)
    }
  }
  return Array.from(seen.values())
}

export async function searchTracksByArtist(artistName) {
  const params = new URLSearchParams({
    term: artistName,
    entity: 'musicTrack',
    attribute: 'artistTerm',
    limit: 200,
  })
  const res = await fetch(`${ITUNES}/search?${params}`)
  if (!res.ok) throw new Error(`Track search failed: ${res.status}`)
  const data = await res.json()
  const tracks = data.results || []

  if (tracks.length === 0) {
    throw new Error('No tracks found for this artist')
  }

  const normalize = (s) => s.toLowerCase().trim()
  const searchedNorm = normalize(artistName)

  return tracks.map((t, i) => ({
    id: t.trackId,
    title: t.trackName,
    preview: t.previewUrl || '',
    rank: (tracks.length - i) * 1000,
    album: {
      cover_medium: t.artworkUrl100 || '',
      cover_big: (t.artworkUrl100 || '').replace(/100x100bb/, '600x600bb'),
      title: t.collectionName || '',
    },
    artist: {
      name: t.artistName || '',
    },
  })).filter(t => {
    if (!t.preview || t.preview.length === 0) return false
    // Exact artist match — prevents wrong-artist tracks from polluting the quiz
    const trackArtistNorm = normalize(t.artist.name)
    return trackArtistNorm === searchedNorm ||
      trackArtistNorm.includes(searchedNorm) ||
      searchedNorm.includes(trackArtistNorm)
  })
}
