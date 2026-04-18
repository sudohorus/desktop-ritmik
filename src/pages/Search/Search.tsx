import { useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import { TrackService } from '../../services/TrackService'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { formatDuration } from '../../utils/format'
import '../../styles/Search.css'

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('')

  const memoizedFetch = useCallback((pageToken?: string) => TrackService.getTrending(pageToken), []);
  const { 
    items: tracks, 
    isLoading, 
    error, 
    handleScroll 
  } = useInfiniteScroll({ fetchData: memoizedFetch });

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div className="search-page">
      <header className="header">
        <div className="header-left">
          <div className="logo">Ritmik</div>
          <nav className="nav-links">
            <a href="#">My Playlists</a>
            <a href="#">Following</a>
            <a href="#">Explore</a>
            <a href="#">Stats</a>
          </nav>
        </div>
        
        <div className="header-right">
          <div className="user-profile" onClick={handleLogout} title="Click to logout">
            <div className="avatar">A</div>
            <span className="username">aaaa</span>
            <svg className="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
        </div>
      </header>

      <main className="main-content" onScroll={handleScroll}>
        <div className="search-section">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search tracks or artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">Search</button>
        </div>

        <div className="trending-section">
          <h2 className="section-title">Trending Tracks</h2>
          
          <div className="tracks-list">
            {error && <p style={{ color: '#ff4d4f', padding: '1rem' }}>Erro: {error}</p>}
            
            {!isLoading && !error && tracks.length === 0 && (
              <p style={{ color: '#888', padding: '1rem' }}>Nenhuma música encontrada.</p>
            )}

            {tracks.map((track, i) => (
              <div key={`${track.id}-${i}`} className="track-card">
                <img src={track.thumbnail} alt={track.title} className="track-image" loading="lazy" />
                <div className="track-info">
                  <div className="track-title">{track.title}</div>
                  <div className="track-artist">{track.artist || track.channel}</div>
                  <div className="track-duration">{formatDuration(track.duration)}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <>
                {Array.from({ length: tracks.length === 0 ? 6 : 3 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="track-card skeleton-card">
                    <div className="track-image skeleton-pulse"></div>
                    <div className="track-info" style={{ flex: 1 }}>
                      <div className="skeleton-text skeleton-pulse" style={{ width: '40%', height: '14px', marginBottom: '6px' }}></div>
                      <div className="skeleton-text skeleton-pulse" style={{ width: '25%', height: '11px', marginBottom: '8px' }}></div>
                      <div className="skeleton-text skeleton-pulse" style={{ width: '15%', height: '10px' }}></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
