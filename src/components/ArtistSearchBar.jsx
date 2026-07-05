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

  const borderStyle = transparent
    ? { border: 'none', borderBottom: '1px solid var(--color-border)' }
    : { border: '1px solid var(--color-border)' }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        aria-label="Search artists"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        placeholder="Search your favorite artist..."
        style={{
          width: '100%',
          padding: transparent ? '14px 0' : '14px 18px',
          fontSize: 16,
          fontWeight: 400,
          fontFamily: 'var(--font-mono)',
          color: '#fff',
          outline: 'none',
          boxSizing: 'border-box',
          borderRadius: transparent ? 0 : 'var(--radius-xl)',
          background: transparent ? 'transparent' : 'rgba(26,26,30,0.6)',
          backdropFilter: transparent ? 'none' : 'blur(16px)',
          WebkitBackdropFilter: transparent ? 'none' : 'blur(16px)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          ...borderStyle,
        }}
        onFocusCapture={(e) => {
          if (!transparent) {
            e.currentTarget.style.borderColor = 'rgba(255,107,53,0.3)'
            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,107,53,0.1)'
          }
        }}
        onBlurCapture={(e) => {
          if (!transparent) {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.boxShadow = 'none'
          }
        }}
      />
      {focused && searchResults.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          zIndex: 10,
        }}>
          {searchResults.slice(0, 7).map((artist) => (
            <ArtistSuggestionCard key={artist.id} artist={artist} onSelect={() => onSelectArtist(artist)} />
          ))}
        </div>
      )}
    </div>
  )
}

function ArtistSuggestionCard({ artist, onSelect }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect() }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        cursor: 'pointer',
        transition: 'background 0.15s',
        fontFamily: 'var(--font-body)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-surface-hover)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <img
        src={artist.picture_medium}
        alt={artist.name}
        style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }}
      />
      <div>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{artist.name}</div>
        <div style={{ color: 'var(--color-muted)', fontSize: 13 }}>Artist</div>
      </div>
    </div>
  )
}
