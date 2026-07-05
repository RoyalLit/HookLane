import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateRounds } from './quizGenerator'

vi.mock('./api', () => ({
  searchTracksByArtist: vi.fn(),
}))

import { searchTracksByArtist } from './api'

function makeTrack(id, title) {
  return {
    id,
    title,
    preview: `https://example.com/preview/${id}.m4a`,
    rank: 0,
    album: { cover_medium: '', cover_big: '', title: `Album ${id}` },
    artist: { name: 'Test Artist' },
  }
}

function makeTracks(count) {
  return Array.from({ length: count }, (_, i) => makeTrack(i + 1, `Track ${i + 1}`))
}

function useDeterministicRandom() {
  vi.spyOn(Math, 'random').mockReturnValue(0)
}

function useRealRandom() {
  vi.restoreAllMocks()
}

beforeEach(() => {
  vi.clearAllMocks()
  useRealRandom()
})

describe('generateRounds', () => {
  it('returns correct number of rounds for a large catalog (30 tracks)', async () => {
    searchTracksByArtist.mockResolvedValue(makeTracks(30))
    const rounds = await generateRounds('Test Artist')
    expect(rounds.length).toBe(10)
  })

  it('each round has exactly 1 correct track and 3 distractors', async () => {
    searchTracksByArtist.mockResolvedValue(makeTracks(30))
    const rounds = await generateRounds('Test Artist')
    for (const round of rounds) {
      expect(round.correctTrack).toBeDefined()
      expect(round.options.length).toBe(4)
      const correctOptions = round.options.filter(o => o.isCorrect)
      expect(correctOptions.length).toBe(1)
      expect(correctOptions[0].track.id).toBe(round.correctTrack.id)
    }
  })

  it('all options within a round have unique track IDs', async () => {
    searchTracksByArtist.mockResolvedValue(makeTracks(30))
    const rounds = await generateRounds('Test Artist')
    for (const round of rounds) {
      const ids = round.options.map(o => o.track.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('distractor pool: same artist, not the played track', async () => {
    const tracks = makeTracks(30)
    const poolIds = new Set(tracks.map(t => t.id))
    searchTracksByArtist.mockResolvedValue(tracks)
    const rounds = await generateRounds('Test Artist')
    for (const round of rounds) {
      for (const opt of round.options) {
        expect(poolIds.has(opt.track.id)).toBe(true)
      }
    }
  })

  it('throws when no tracks found', async () => {
    searchTracksByArtist.mockResolvedValue([])
    await expect(generateRounds('Unknown Artist')).rejects.toThrow(
      'No preview-capable tracks found',
    )
  })

  it('handles artist with exactly 5 tracks — returns 5 rounds', async () => {
    searchTracksByArtist.mockResolvedValue(makeTracks(5))
    const rounds = await generateRounds('Test Artist')
    expect(rounds.length).toBe(5)
    for (const round of rounds) {
      expect(round.options.length).toBeGreaterThanOrEqual(2)
      expect(round.options.filter(o => o.isCorrect).length).toBe(1)
    }
  })

  it('handles artist with exactly 3 tracks — returns 3 rounds (minimum viable)', async () => {
    searchTracksByArtist.mockResolvedValue(makeTracks(3))
    const rounds = await generateRounds('Test Artist')
    expect(rounds.length).toBe(3)
  })

  it('handles artist with 7 tracks — variable round count boundary', async () => {
    searchTracksByArtist.mockResolvedValue(makeTracks(7))
    const rounds = await generateRounds('Test Artist')
    expect(rounds.length).toBe(7)
  })

  it('handles artist with exactly 10 tracks', async () => {
    searchTracksByArtist.mockResolvedValue(makeTracks(10))
    const rounds = await generateRounds('Test Artist')
    expect(rounds.length).toBe(10)
  })

  it('distributes rounds across tertiles with deterministic random', async () => {
    useDeterministicRandom()
    searchTracksByArtist.mockResolvedValue(makeTracks(30))
    const rounds = await generateRounds('Test Artist')
    expect(rounds.length).toBe(10)
    const popular = rounds.filter(r => r.correctTrack.id <= 10).length
    const mid = rounds.filter(r => r.correctTrack.id > 10 && r.correctTrack.id <= 20).length
    const deep = rounds.filter(r => r.correctTrack.id > 20).length
    expect(popular).toBe(2)
    expect(mid).toBe(3)
    expect(deep).toBe(5)
  })

  it('favors same-tertile distractors', async () => {
    useDeterministicRandom()
    searchTracksByArtist.mockResolvedValue(makeTracks(10))
    const rounds = await generateRounds('Test Artist')
    for (const round of rounds) {
      const distractorIds = round.options
        .filter(o => !o.isCorrect)
        .map(o => o.track.id)
      expect(distractorIds.includes(round.correctTrack.id)).toBe(false)
    }
  })

  it('distractors are unique per round across all rounds', async () => {
    searchTracksByArtist.mockResolvedValue(makeTracks(12))
    const rounds = await generateRounds('Test Artist')
    for (const round of rounds) {
      const ids = round.options.map(o => o.track.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('does not mutate the original tracks array', async () => {
    const tracks = makeTracks(15)
    const originalLength = tracks.length
    searchTracksByArtist.mockResolvedValue(tracks)
    await generateRounds('Test Artist')
    expect(tracks.length).toBe(originalLength)
  })
})
