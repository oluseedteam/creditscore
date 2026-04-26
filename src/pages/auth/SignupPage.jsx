import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71'
const programFeatures = [
  'Monthly credit score analytics',
  'Strategic coaching cards',
  'Curriculum attendance tracking',
  'Validated loan gateway access'
]

export default function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name:'', email:'', password:'', confirm:'' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (form.password!==form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length<6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try { 
      signup(form.name,form.email,form.password)
      navigate('/dashboard') 
    }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex" style={{background:'#F9F5EF'}}>
      {/* Left panel: Program Overview */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden" style={{background:NAVY}}>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(6,106,111,0.15)'}}/>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(244,176,0,0.08)'}}/>

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:TEAL}}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="2.5" fill="#2FBF71"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white text-xl">MyScoreNova</span>
        </Link>

        <div className="relative z-10">
          <h2 className="font-display text-4xl font-bold text-white leading-tight mb-8">
            Strategic Path to<br/><span className="text-gradient-teal">Homeownership.</span>
          </h2>
          <div className="space-y-4">
            {programFeatures.map((p,i)=>(
              <div key={i} className="flex items-center gap-3">
                <CheckCircle size={18} style={{color:PGREEN}} className="shrink-0"/>
                <span className="text-sm" style={{color:'rgba(255,255,255,0.8)'}}>{p}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 rounded-2xl p-6" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)'}}>
          <p className="text-sm font-display mb-4" style={{color:'rgba(255,255,255,0.75)'}}>
            "Registering for the program provided the structure necessary to meet lending requirements. My score delta was over 200 points within three quarters."
          </p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{background:TEAL,color:'white'}}>AJ</div>
            <div>
              <p className="text-white text-xs font-medium">Alex J.</p>
              <p className="text-xs" style={{color:'#4db2b2'}}>Program Graduate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:TEAL}}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/></svg>
              </div>
              <span className="font-display font-bold" style={{color:NAVY}}>MyScoreNova</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold mb-1" style={{color:NAVY}}>Program Registration</h1>
          <p className="mb-8" style={{color:'#6B7280'}}>Establish your professional profile to begin</p>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-6" style={{background:'#fef0f0',border:'1px solid #faaeae',color:'#cc5858'}}>
              <AlertCircle size={16} className="shrink-0"/>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" required className="input-field" placeholder="Full legal name"
                value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
            </div>
            <div>
              <label className="label">Email Address</label>
              <input type="email" required className="input-field" placeholder="email@address.com"
                value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
            </div>
            <div>
              <label className="label">Secure Password</label>
              <div className="relative">
                <input type={showPass?'text':'password'} required className="input-field pr-12" placeholder="Min. 6 characters"
                  value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
                <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{color:'#6B7280'}}>
                  {showPass?<EyeOff size={18}/>:<Eye size={18}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Verify Password</label>
              <input type="password" required className="input-field" placeholder="Repeat secure password"
                value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))}/>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
              ) : (
                <>Initialize Account <ArrowRight size={18}/></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{color:'#6B7280'}}>
            Existing participant?{' '}
            <Link to="/login" className="font-medium" style={{color:TEAL}}>Sign in to portal</Link>
          </p>
        </div>
      </div>
    </div>
  )
}