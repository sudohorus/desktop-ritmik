import { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface LoginProps {
  onGoToSignUp: () => void
}

export default function Login({ onGoToSignUp }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message)
    }
  }

  return (
    <div className="page">
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="brand-name">Ritmik</h1>
          <p className="brand-subtitle">Sign in to your account</p>
        </div>

        <form className="login-card" onSubmit={handleLogin}>
          {error && <p className="error-msg">{error}</p>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="forgot-link">
            <a href="#">Forgot your password?</a>
          </div>

          <button className="btn-signin" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="signup-text">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); onGoToSignUp() }}>Sign up</a>
          </p>
        </form>

        <div className="login-footer">
          <a href="#">← Back to home</a>
          <div className="footer-links">
            <a href="#">Terms of Use</a>
            <span>•</span>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </div>
  )
}
