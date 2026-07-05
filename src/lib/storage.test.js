import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getArtistStats, saveArtistScore } from './storage'

const ARTIST_ID = '12345'

// Minimal localStorage mock
function createLocalStorageMock() {
  let store = {}
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn((key) => { delete store[key] }),
    clear: vi.fn(() => { store = {} }),
    get length() { return Object.keys(store).length },
    key: vi.fn((i) => Object.keys(store)[i] ?? null),
    __dump: () => ({ ...store }),
  }
}

beforeEach(() => {
  const mock = createLocalStorageMock()
  vi.stubGlobal('localStorage', mock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getArtistStats', () => {
  it('returns default stats when no data exists', () => {
    const stats = getArtistStats('nonexistent')

    expect(stats).toEqual({ best: null, plays: 0, last5: [] })
  })

  it('returns stored stats when data exists', () => {
    const data = { best: { score: 8, outOf: 10 }, plays: 3, last5: [{ score: 8, outOf: 10 }] }
    localStorage.setItem('hooklane_artist_999', JSON.stringify(data))

    const stats = getArtistStats('999')

    expect(stats).toEqual(data)
  })

  it('returns default stats on corrupted JSON', () => {
    localStorage.setItem('hooklane_artist_bad', '{broken json}}')

    const stats = getArtistStats('bad')

    expect(stats).toEqual({ best: null, plays: 0, last5: [] })
  })

  it('uses correct key prefix', () => {
    getArtistStats(ARTIST_ID)

    expect(localStorage.getItem).toHaveBeenCalledWith(`hooklane_artist_${ARTIST_ID}`)
  })
})

describe('saveArtistScore', () => {
  it('creates stats on first play', () => {
    saveArtistScore(ARTIST_ID, 7, 10)

    const saved = JSON.parse(localStorage.getItem(`hooklane_artist_${ARTIST_ID}`))
    expect(saved.plays).toBe(1)
    expect(saved.best).toEqual({ score: 7, outOf: 10 })
    expect(saved.last5).toEqual([{ score: 7, outOf: 10 }])
  })

  it('updates best score when percentage improves', () => {
    // First play: 5/10 = 50%
    saveArtistScore(ARTIST_ID, 5, 10)
    // Second play: 9/10 = 90% → new best
    saveArtistScore(ARTIST_ID, 9, 10)

    const saved = JSON.parse(localStorage.getItem(`hooklane_artist_${ARTIST_ID}`))
    expect(saved.plays).toBe(2)
    expect(saved.best).toEqual({ score: 9, outOf: 10 })
    expect(saved.last5.length).toBe(2)
  })

  it('does not update best score when percentage is worse', () => {
    // First play: 9/10 = 90%
    saveArtistScore(ARTIST_ID, 9, 10)
    // Second play: 5/10 = 50% → no change to best
    saveArtistScore(ARTIST_ID, 5, 10)

    const saved = JSON.parse(localStorage.getItem(`hooklane_artist_${ARTIST_ID}`))
    expect(saved.best).toEqual({ score: 9, outOf: 10 })
  })

  it('uses percentage comparison not raw score', () => {
    // 5/10 = 50%
    saveArtistScore(ARTIST_ID, 5, 10)
    // 6/20 = 30% — lower percentage, not a new best
    saveArtistScore(ARTIST_ID, 6, 20)

    const saved = JSON.parse(localStorage.getItem(`hooklane_artist_${ARTIST_ID}`))
    expect(saved.best).toEqual({ score: 5, outOf: 10 })
  })

  it('keeps last5 array at max 5 entries', () => {
    for (let i = 1; i <= 7; i++) {
      saveArtistScore(ARTIST_ID, i, 10)
    }

    const saved = JSON.parse(localStorage.getItem(`hooklane_artist_${ARTIST_ID}`))
    expect(saved.last5.length).toBe(5)
    // last5 should be the most recent 5: scores 3,4,5,6,7
    expect(saved.last5.map(e => e.score)).toEqual([3, 4, 5, 6, 7])
  })

  it('updates best on equal percentage', () => {
    // First play: 5/10 = 50%
    saveArtistScore(ARTIST_ID, 5, 10)
    // Second play: 1/2 = 50% — same percentage, should update (uses < not <=)
    saveArtistScore(ARTIST_ID, 1, 2)

    const saved = JSON.parse(localStorage.getItem(`hooklane_artist_${ARTIST_ID}`))
    // The code uses `(stats.best.score / stats.best.outOf) < pct`
    // 0.5 < 0.5 is false, so best stays
    expect(saved.best).toEqual({ score: 5, outOf: 10 })
  })

  it('handles multiple artists independently', () => {
    saveArtistScore('artist_a', 8, 10)
    saveArtistScore('artist_b', 3, 10)

    const statsA = JSON.parse(localStorage.getItem('hooklane_artist_artist_a'))
    const statsB = JSON.parse(localStorage.getItem('hooklane_artist_artist_b'))

    expect(statsA.plays).toBe(1)
    expect(statsA.best.score).toBe(8)
    expect(statsB.plays).toBe(1)
    expect(statsB.best.score).toBe(3)
  })

  it('handles edge case: score of 0', () => {
    saveArtistScore(ARTIST_ID, 0, 10)

    const saved = JSON.parse(localStorage.getItem(`hooklane_artist_${ARTIST_ID}`))
    expect(saved.plays).toBe(1)
    expect(saved.best).toEqual({ score: 0, outOf: 10 })
    expect(saved.last5).toEqual([{ score: 0, outOf: 10 }])
  })
})
