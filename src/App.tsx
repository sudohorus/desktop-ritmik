import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'

import Login from './pages/Login/Login'
import SignUp from './pages/SignUp/SignUp'
import Search from './pages/Search/Search'

import './styles/App.css'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [view, setView] = useState<'login' | 'signup'>('login')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f0f13', color: '#fff' }}>Carregando...</div>
  }
  if (session) {
    return <Search />
  }

  if (view === 'signup') {
    return <SignUp onGoToLogin={() => setView('login')} />
  }

  return <Login onGoToSignUp={() => setView('signup')} />
}

export default App
