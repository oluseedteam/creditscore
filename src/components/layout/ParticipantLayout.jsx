import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, BookOpen, Key, LogOut, Menu, X, HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const TEAL='#066A6F', NAVY='#102A43'
const nav = [
  { to:'/dashboard',      icon:LayoutDashboard, label:'Dashboard' },
  { to:'/credit-score',   icon:TrendingUp,      label:'Credit Score' },
  { to:'/class-progress', icon:BookOpen,        label:'Class Progress' },
  { to:'/loan-gateway',   icon:Key,             label:'Loan Gateway' },
  { to:'/quiz',           icon:HelpCircle,      label:'CBT Test' },
]

function Logo() {
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:TEAL}}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
          <circle cx="10" cy="10" r="2.5" fill="#2FBF71"/><circle cx="10" cy="10" r="1" fill="white"/>
        </svg>
      </div>
      <div>
        <p className="font-display font-bold text-base" style={{color:NAVY}}>MyScoreNova</p>
        <p className="text-xs" style={{color:'#6B7280'}}>Participant portal</p>
      </div>
    </div>
  )
}

export default function ParticipantLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = ({ mobile }) => (
    <aside className={`flex flex-col justify-between bg-white border-r ${mobile?'w-64 h-full p-6':'w-64 min-h-screen p-6 hidden lg:flex'}`} style={{borderColor:'#E3E6EC'}}>
      <div>
        <Logo/>
        <nav className="space-y-1">
          {nav.map(({to,icon:Icon,label})=>(
            <NavLink key={to} to={to} onClick={()=>setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={({isActive})=>isActive
                ?{background:'#e6f4f4',color:TEAL,border:'1px solid #b3dede'}
                :{color:'#6B7280'}
              }>
              {({isActive})=><><Icon size={18}/>{label}</>}
            </NavLink>
          ))}
        </nav>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{background:'#F9F5EF'}}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{background:'#e6f4f4',color:TEAL}}>
            {user?.name?.split(' ').map(n=>n[0]).join('').slice(0,2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{color:NAVY}}>{user?.name}</p>
            <p className="text-xs truncate" style={{color:'#6B7280'}}>{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all" style={{color:'#6B7280'}}
          onMouseEnter={e=>{e.currentTarget.style.background='#fef0f0';e.currentTarget.style.color='#cc5858'}}
          onMouseLeave={e=>{e.currentTarget.style.background='';e.currentTarget.style.color='#6B7280'}}>
          <LogOut size={16}/> Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen" style={{background:'#F9F5EF'}}>
      <Sidebar/>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between" style={{borderColor:'#E3E6EC'}}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:TEAL}}>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/></svg>
          </div>
          <span className="font-display font-bold text-sm" style={{color:NAVY}}>MyScoreNova</span>
        </div>
        <button onClick={()=>setMobileOpen(s=>!s)} className="p-2 rounded-lg transition-colors" style={{color:NAVY}}>
          {mobileOpen?<X size={20}/>:<Menu size={20}/>}
        </button>
      </div>
      {mobileOpen&&(
        <div className="lg:hidden fixed inset-0 z-30 flex" onClick={()=>setMobileOpen(false)}>
          <div className="flex-1" style={{background:'rgba(0,0,0,0.2)'}}/>
          <div onClick={e=>e.stopPropagation()}><Sidebar mobile/></div>
        </div>
      )}
      <main className="flex-1 min-w-0 lg:pt-0 pt-14"><Outlet/></main>
    </div>
  )
}