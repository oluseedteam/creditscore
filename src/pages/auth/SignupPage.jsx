import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const perks = [
  'Monthly credit score tracking',
  'AI-powered coaching cards',
  'Class attendance monitoring',
  'Gamified loan gateway',
]

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      signup(form.name, form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-navy-900 p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-grain" />
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-forest-600/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-forest-600/10 blur-3xl" />

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-forest-500 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="2.5" fill="white"/></svg>
          </div>
          <span className="font-display font-semibold text-white text-lg">Path to Ownership</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-8">
            Your home is<br /><span className="text-forest-400">within reach.</span>
          </h2>
          <div className="space-y-4">
            {perks.map((perk, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-forest-400 shrink-0" />
                <span className="text-white/80 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-white/70 text-sm italic font-display mb-4">
            "Signing up was the first real step I took toward owning my home. I went from 498 to 712 in seven months."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-forest-300 text-xs">AJ</div>
            <div>
              <p className="text-white text-xs font-medium">Alex J.</p>
              <p className="text-forest-400 text-xs">Now a homeowner</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-forest-600 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="2.5" fill="white"/></svg>
              </div>
              <span className="font-display font-semibold text-navy-900">Path to Ownership</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold text-navy-900 mb-1">Create your account</h1>
          <p className="text-navy-800/60 mb-8">Start your journey to homeownership today</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm mb-6">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input type="text" required className="input-field" placeholder="Your full name"
                value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
            </div>
            <div>
              <label className="label">Email address</label>
              <input type="email" required className="input-field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required className="input-field pr-12"
                  placeholder="At least 6 characters" value={form.password}
                  onChange={e => setForm(f => ({...f, password: e.target.value}))} />
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-800/40 hover:text-navy-800/70 transition-colors">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input type="password" required className="input-field" placeholder="Repeat password"
                value={form.confirm} onChange={e => setForm(f => ({...f, confirm: e.target.value}))} />
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Create account <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-navy-800/60 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-forest-600 hover:text-forest-700 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}