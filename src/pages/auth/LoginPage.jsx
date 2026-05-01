import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { 
      const user = await login(form.email, form.password)
      navigate(user.role==='admin'?'/admin':'/dashboard') 
    }
    catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const fillDemo = (role) => role==='admin'
    ? setForm({email:'admin@pto.com',password:'admin123'})
    : setForm({email:'alex@demo.com',password:'demo123'})

  return (
    <div className="min-h-screen flex" style={{background:'#F9F5EF'}}>
      {/* Left panel: Program Analytics & Branding */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden" style={{background:`linear-gradient(150deg,${TEAL} 0%,${NAVY} 100%)`}}>
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"}}/>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{background:'rgba(47,191,113,0.1)'}}/>

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:PGREEN}}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
              <circle cx="10" cy="10" r="2.5" fill="white"/>
            </svg>
          </div>
          <span className="font-display font-bold text-white text-xl">MyScoreNova</span>
        </Link>

        <div className="relative z-10">
          <blockquote className="font-display text-3xl font-semibold text-white leading-tight mb-6">
            Securely manage your data and track program milestones through the central portal.
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium" style={{background:'rgba(255,255,255,0.1)',color:'white'}}>TPC</div>
            <div>
              <p className="text-white text-sm font-medium">Tina Patton Consulting</p>
              <p className="text-sm" style={{color:'#4db2b2'}}>Homeownership Strategy Program</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4 border-t pt-8" style={{borderColor:'rgba(255,255,255,0.1)'}}>
          {[['500+','Total Households'],['127pts','Avg. Delta'],['94%','Validation Rate']].map(([val,lbl])=>(
            <div key={lbl} className="text-center">
              <p className="font-display text-2xl font-bold text-white">{val}</p>
              <p className="text-xs mt-0.5" style={{color:'#4db2b2'}}>{lbl}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel: Authentication */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{background:TEAL}}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/></svg>
              </div>
              <span className="font-display font-bold" style={{color:NAVY}}>MyScoreNova</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl font-bold mb-1" style={{color:NAVY}}>Portal Access</h1>
          <p className="mb-8" style={{color:'#6B7280'}}>Sign in to access your program dashboard</p>

          <div className="flex gap-2 mb-6">
            {[['participant','Participant Access'],['admin','Administrative Access']].map(([r,l])=>(
              <button key={r} onClick={()=>fillDemo(r)} className="flex-1 text-[11px] py-2 px-3 rounded-lg border transition-colors hover:bg-gray-50" style={{borderColor:'#E3E6EC',color:'#6B7280',background:'white'}}>{l}</button>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-6" style={{background:'#fef0f0',border:'1px solid #faaeae',color:'#cc5858'}}>
              <AlertCircle size={16} className="shrink-0"/>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Registered Email</label>
              <input type="email" required className="input-field" placeholder="email@address.com"
                value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
            </div>
            <div>
              <label className="label">Secure Password</label>
              <div className="relative">
                <input type={showPass?'text':'password'} required className="input-field pr-12" placeholder="••••••••"
                  value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
                <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{color:'#6B7280'}}>
                  {showPass?<EyeOff size={18}/>:<Eye size={18}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
              ) : (
                <>Authenticate Access <ArrowRight size={18}/></>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{color:'#6B7280'}}>
            New to the program?{' '}
            <Link to="/signup" className="font-medium transition-colors" style={{color:TEAL}}>Register account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}