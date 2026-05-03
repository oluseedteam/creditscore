import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71'

export default function AdminLoginPage() {
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

  const fillDemo = () => setForm({email:'admin@pto.com',password:'admin123'})

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="min-h-screen flex" style={{background:'#F9F5EF'}}>
      {/* Left panel: Admin Branding */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 p-12 relative overflow-hidden" style={{background:`linear-gradient(150deg,${NAVY} 0%,#000 100%)`}}>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"}}/>
        
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white">
             <ShieldCheck size={20} style={{color:NAVY}} />
          </div>
          <span className="font-display font-bold text-white text-xl">System Admin</span>
        </Link>
        <div className="relative z-10">
          <blockquote className="font-display text-3xl font-semibold text-white leading-tight mb-6">
            Administrator Gateway
          </blockquote>
        </div>
      </div>

      {/* Right panel: Authentication */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-up">
          <h1 className="font-display text-3xl font-bold mb-1" style={{color:NAVY}}>Admin Access</h1>
          <p className="mb-8" style={{color:'#6B7280'}}>Sign in to manage the platform</p>

          <div className="flex gap-2 mb-6">
            <button type="button" onClick={fillDemo} className="flex-1 text-[11px] py-2 px-3 rounded-lg border transition-colors hover:bg-gray-50 bg-teal-50 text-teal-800 font-bold" style={{borderColor:'#E3E6EC'}}>Fill Admin Demo</button>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-6 bg-red-50 text-red-600 border border-red-200">
              <AlertCircle size={16} className="shrink-0"/>{error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Admin Email</label>
              <input type="email" required className="input-field" placeholder="admin@domain.com"
                value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
            </div>
            <div>
              <label className="label">Admin Password</label>
              <div className="relative">
                <input type={showPass?'text':'password'} required className="input-field pr-12" placeholder="••••••••"
                  value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))}/>
                <button type="button" onClick={()=>setShowPass(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors" style={{color:'#6B7280'}}>
                  {showPass?<EyeOff size={18}/>:<Eye size={18}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60" style={{background:NAVY}}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"/>
              ) : (
                <>Authorize Admin <ArrowRight size={18}/></>
              )}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
