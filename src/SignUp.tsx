import { useState } from 'react'
import { supabase } from './lib/supabase'

interface SignUpProps {
  onGoToLogin: () => void
}

function SignUp({ onGoToLogin }: SignUpProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (username.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="page">
        <div className="login-wrapper">
          <div className="login-header">
            <h1 className="brand-name">Ritmik</h1>
            <p className="brand-subtitle">Check your email</p>
          </div>
          <div className="login-card">
            <p className="success-msg">
              We sent a confirmation link to <strong>{email}</strong>. Open it to activate your account.
            </p>
            <button className="btn-signin" onClick={onGoToLogin}>
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="login-wrapper">
        <div className="login-header">
          <h1 className="brand-name">Ritmik</h1>
          <p className="brand-subtitle">Create your account</p>
        </div>

        <form className="login-card" onSubmit={handleSignUp}>
          {error && <p className="error-msg">{error}</p>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              placeholder="sudohorus"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <span className="field-hint">At least 3 characters</span>
          </div>

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
            <span className="field-hint">At least 6 characters</span>
          </div>

          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <p className="terms-text">
            By signing up, you agree to our{' '}
            <a href="#">Terms of Use</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </p>

          <button className="btn-signin" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>

          <p className="signup-text">
            Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); onGoToLogin() }}>Sign in</a>
          </p>
        </form>

        <div className="login-footer">
          <a href="#">← Back to home</a>
        </div>
      </div>
    </div>
  )
}

export default SignUp
