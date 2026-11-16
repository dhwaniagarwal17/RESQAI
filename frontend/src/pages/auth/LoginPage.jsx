import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlertCircle, LogIn } from 'lucide-react'
import { login } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

const ROLE_ROUTES = {
  reporter:    '/reporter',
  admin:       '/admin',
  rescue_team: '/rescue',
}

// Quick-fill demo credentials
const DEMO_ACCOUNTS = [
  { label: 'Citizen',     email: 'citizen@resqai.demo', role: 'reporter' },
  { label: 'Admin',       email: 'admin@resqai.demo',   role: 'admin' },
  { label: 'Rescue Team', email: 'alpha@resqai.demo',   role: 'rescue_team' },
]

export default function LoginPage() {
  const navigate       = useNavigate()
  const location       = useLocation()
  const { setLoggedInUser } = useAuth()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  // Redirect target after login (e.g. if user was redirected from a protected route)
  const from = location.state?.from?.pathname || null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { user } = await login({ email, password })
      setLoggedInUser(user)
      const destination = from || ROLE_ROUTES[user.role] || '/'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  function fillDemo(account) {
    setEmail(account.email)
    setPassword('Demo1234!')
    setError(null)
  }

  return (
    <div className="min-h-screen bg-linen flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold tracking-tight text-carbon">RESQAI</p>
          <p className="text-xs text-carbon/40 mt-1">AI-Assisted Disaster Response</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-carbon/10 rounded p-6">
          <h1 className="text-base font-semibold text-carbon mb-5">Sign in to your account</h1>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-coral/8 border border-coral/20 rounded p-3 mb-4">
              <AlertCircle size={14} className="text-coral mt-0.5 flex-shrink-0" />
              <p className="text-xs text-coral leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/20 transition-colors"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/20 transition-colors"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-carbon text-white text-sm font-medium py-2.5 rounded flex items-center justify-center gap-2 hover:bg-carbon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={14} strokeWidth={2} />
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Demo credentials */}
        <div className="mt-5 border border-carbon/10 rounded p-4 bg-linen">
          <p className="text-2xs font-semibold tracking-widest uppercase text-carbon/40 mb-3">
            Development Demo
          </p>
          <div className="space-y-1.5">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => fillDemo(acc)}
                className="w-full text-left px-3 py-2 rounded border border-carbon/10 bg-white hover:border-carbon/25 hover:bg-white transition-all text-xs"
              >
                <span className="font-medium text-carbon">{acc.label}</span>
                <span className="text-carbon/40 ml-2">{acc.email}</span>
              </button>
            ))}
          </div>
          <p className="text-2xs text-carbon/30 mt-2.5">Password for all: Demo1234!</p>
          <p className="text-2xs text-carbon/25 mt-1">
            Requires backend + MongoDB running. Run <code className="font-mono">node seed.js</code> in backend/.
          </p>
        </div>

        {/* Back to landing */}
        <p className="text-center mt-5">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-carbon/40 hover:text-carbon transition-colors"
          >
            ← Back to home
          </button>
        </p>
      </div>
    </div>
  )
}
