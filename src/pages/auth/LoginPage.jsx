import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = login(form.email, form.password)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@pto.com', password: 'admin123' })
    else setForm({ email: 'alex@demo.com', password: 'demo123' })
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-forest-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grain" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-forest-500/20 blur-3xl" />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-forest-500 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="2.5" fill="white"/></svg>
          </div>
          <span className="font-display font-semibold text-white text-lg">Path to Ownership</span>
        </Link>

        <div className="relative z-10">
          <blockquote className="font-display text-3xl font-semibold text-white leading-tight mb-6 italic">
            "Every great journey begins with a single step — and yours starts here."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center text-forest-200 text-sm font-medium">PO</div>
            <div>
              <p className="text-white text-sm font-medium">Path to Ownership</p>
              <p className="text-forest-400 text-xs">AI Credit & Class Management</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[['500+','Homeowners'],['127pts','Avg. gain'],['94%','Success rate']].map(([val, lbl]) => (
            <div key={lbl} className="text-center">
              <p className="font-display text-2xl font-bold text-white">{val}</p>
              <p className="text-forest-400 text-xs mt-0.5">{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-2 lg:hidden">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-7 h-7 rounded-lg bg-forest-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="2.5" fill="white"/></svg>
              </div>
              <span className="font-display font-semibold text-navy-900">Path to Ownership</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold text-navy-900 mb-1">Welcome back</h1>
          <p className="text-navy-800/60 mb-8">Sign in to continue your journey</p>

          {/* Quick fill */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => fillDemo('participant')} className="flex-1 text-xs py-2 px-3 rounded-lg border border-cream-300 text-navy-800/70 hover:bg-cream-100 transition-colors">
              Demo: Participant
            </button>
            <button onClick={() => fillDemo('admin')} className="flex-1 text-xs py-2 px-3 rounded-lg border border-cream-300 text-navy-800/70 hover:bg-cream-100 transition-colors">
              Demo: Admin
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input type="email" required className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required className="input-field pr-12"
                  placeholder="Your password" value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-800/40 hover:text-navy-800/70 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Sign in <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-navy-800/60 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-forest-600 hover:text-forest-700 transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
