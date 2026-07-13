import { useState, useEffect, useRef } from 'react'
import useStore from '../store'
import { searchArtists } from '../lib/api'

export default function ArtistSearchBar({ onSelectArtist, transparent }) {
  const searchQuery = useStore((s) => s.searchQuery)
  const searchResults = useStore((s) => s.searchResults)
  const setSearchQuery = useStore((s) => s.setSearchQuery)
  const setSearchResults = useStore((s) => s.setSearchResults)
  const setSearchLoading = useStore((s) => s.setSearchLoading)

  const [focused, setFocused] = useState(false)
  const debounceRef = useRef(null)
  const abortRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    abortRef.current?.abort()
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    setSearchLoading(true)
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const results = await searchArtists(searchQuery.trim(), { signal: controller.signal })
        if (!controller.signal.aborted) setSearchResults(results)
      } catch (e) {
        if (e.name !== 'AbortError') setSearchResults([])
      }
    }, 300)
  }, [searchQuery])

  return (
    <div className="relative w-full">
      <div className={`
        flex items-center gap-3 transition-all duration-200
        ${transparent
          ? 'bg-transparent px-0 py-2 border-none border-b border-[var(--color-border)] rounded-none'
          : 'bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border)] rounded-full px-5 py-3'
        }
        focus-within:border-[var(--color-accent)]/30
        focus-within:shadow-[0_0_30px_var(--color-accent-glow)]
      `}>
        <svg className="w-5 h-5 text-[var(--color-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input
          type="text"
          aria-label="Search artists"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search your favorite artist..."
          className={`
            flex-1 bg-transparent text-[var(--color-text-primary)] placeholder-[var(--color-muted)] text-base outline-none font-mono
            ${transparent ? 'px-0' : ''}
          `}
          autoComplete="off"
          spellCheck={false}
        />
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); setSearchResults([]) }}
            aria-label="Clear search"
            className="p-1 text-[var(--color-muted)] hover:text-white transition-colors rounded-full shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      {focused && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden z-10 animate-fadeIn">
          {searchResults.slice(0, 7).map((artist) => (
            <ArtistSuggestionCard key={artist.id} artist={artist} onSelect={onSelectArtist} />
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function ArtistSuggestionCard({ artist, onSelect }) {
  return (
    <button
      role="button"
      tabIndex={0}
      onClick={() => onSelect(artist)}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(artist) } }}
      className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-[var(--color-surface-hover)] transition-colors font-body focus-visible:outline-none focus-visible:bg-[var(--color-surface-hover)]"
    >
      <img
        src={artist.picture_medium}
        alt=""
        className="w-10 h-10 rounded-full object-cover"
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="font-medium text-sm text-[var(--color-text-primary)] truncate">{artist.name}</p>
        {artist.nb_fan && <p className="text-xs text-[var(--color-text-secondary)]">{artist.nb_fan.toLocaleString()} fans</p>}
      </div>
      <svg className="w-4 h-4 text-[var(--color-muted)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
    </button>
  )
}