import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, UserPlus } from 'lucide-react'
import { register } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

const ROLE_ROUTES = {
  reporter:    '/reporter',
  admin:       '/admin',
  rescue_team: '/rescue',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setLoggedInUser } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reporter',
    phone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { user } = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
      })
      
      setLoggedInUser(user)
      const destination = ROLE_ROUTES[user.role] || '/'
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linen flex flex-col items-center justify-center px-4 py-12 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-xl font-bold tracking-tight text-carbon">RESQAI</p>
          <p className="text-xs text-carbon/40 mt-1">AI-Assisted Disaster Response</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-carbon/10 rounded p-6">
          <h1 className="text-base font-semibold text-carbon mb-5">Create your account</h1>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-coral/8 border border-coral/20 rounded p-3 mb-4">
              <AlertCircle size={14} className="text-coral mt-0.5 flex-shrink-0" />
              <p className="text-xs text-coral leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="name">
                Full Name <span className="text-coral">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/20 transition-colors"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="email">
                Email <span className="text-coral">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/20 transition-colors"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="password">
                Password <span className="text-coral">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/20 transition-colors"
                disabled={loading}
                required
              />
              <p className="text-2xs text-carbon/40 mt-1">At least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="confirmPassword">
                Confirm Password <span className="text-coral">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/20 transition-colors"
                disabled={loading}
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="role">
                I am a <span className="text-coral">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/20 transition-colors"
                disabled={loading}
                required
              >
                <option value="reporter">Citizen / Reporter</option>
                <option value="rescue_team">Rescue Team Member</option>
                <option value="admin">Administrator</option>
              </select>
              <p className="text-2xs text-carbon/40 mt-1">
                {formData.role === 'reporter' && 'Report emergencies and track your submissions'}
                {formData.role === 'rescue_team' && 'View assigned incidents and update status'}
                {formData.role === 'admin' && 'Manage incidents and assign rescue teams'}
              </p>
            </div>

            {/* Phone (optional) */}
            <div>
              <label className="block text-xs font-medium text-carbon/70 mb-1" htmlFor="phone">
                Phone Number (optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1234567890"
                className="w-full border border-carbon/20 rounded px-3 py-2 text-sm text-carbon placeholder-carbon/30 focus:outline-none focus:border-carbon/50 focus:ring-1 focus:ring-carbon/20 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-carbon text-white text-sm font-medium py-2.5 rounded flex items-center justify-center gap-2 hover:bg-carbon/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus size={14} strokeWidth={2} />
              )}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center mt-4 text-xs text-carbon/50">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-carbon font-medium hover:underline"
            >
              Sign in
            </button>
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
