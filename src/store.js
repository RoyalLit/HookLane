import { create } from 'zustand'

const useStore = create((set, get) => ({
  screen: 'search',
  searchQuery: '',
  searchResults: [],
  searchLoading: false,
  selectedArtist: null,
  tracks: [],
  rounds: [],
  currentRound: 0,
  score: 0,
  answers: [],
  totalRounds: 0,
  quizLoading: false,
  quizError: null,
  difficulty: 'medium', // 'easy' | 'medium' | 'hard'

  setSearchQuery: (q) => set({ searchQuery: q }),

  toastMessage: null,

  setSearchResults: (results) => set({ searchResults: results, searchLoading: false }),

  setSearchLoading: (v) => set({ searchLoading: v }),

  setToast: (message) => set({ toastMessage: message }),

  clearToast: () => set({ toastMessage: null }),

  setDifficulty: (difficulty) => set({ difficulty }),

  startQuiz: (artist, tracks, rounds, difficulty) => set({
    screen: 'quiz',
    selectedArtist: artist,
    tracks,
    rounds,
    currentRound: 0,
    score: 0,
    answers: [],
    totalRounds: rounds.length,
    quizLoading: false,
    quizError: null,
    difficulty: difficulty || get().difficulty,
  }),

  setQuizLoading: (v) => set({ quizLoading: v }),

  setQuizError: (err) => set({ quizError: err, quizLoading: false }),

  answerQuestion: (selectedTrackId) => {
    const { rounds, currentRound, score, answers } = get()
    const round = rounds[currentRound]
    if (!round) return

    const correctId = round.correctTrack.id
    const isCorrect = selectedTrackId === correctId

    set({
      answers: [...answers, { correctId, selectedId: selectedTrackId, isCorrect }],
      score: isCorrect ? score + 1 : score,
    })
  },

  nextRound: () => {
    const { currentRound, totalRounds } = get()
    if (currentRound + 1 >= totalRounds) {
      set({ screen: 'score' })
    } else {
      set({ currentRound: currentRound + 1 })
    }
  },

  exitQuiz: () => set({
    screen: 'search',
    searchQuery: '',
    searchResults: [],
    selectedArtist: null,
    tracks: [],
    rounds: [],
    currentRound: 0,
    score: 0,
    answers: [],
    totalRounds: 0,
  }),

  newArtist: () => set({
    screen: 'search',
    searchQuery: '',
    searchResults: [],
    selectedArtist: null,
    tracks: [],
    rounds: [],
    currentRound: 0,
    score: 0,
    answers: [],
    totalRounds: 0,
  }),
}))

export default useStore
