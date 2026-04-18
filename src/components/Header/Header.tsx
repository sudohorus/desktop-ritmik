import { supabase } from '../../lib/supabase'
import './Header.css'

export default function Header() {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">Ritmik</div>
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
  )
}
