import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Shield, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const handleLogout = () => { 
    logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  return (
    <div className="flex min-h-screen" style={{background:'#F9F5EF'}}>
      {/* Desktop Sidebar */}
      <aside className="w-60 min-h-screen p-6 hidden lg:flex flex-col justify-between" style={{background:NAVY}}>
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:TEAL}}>
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10" r="2.5" fill={PGREEN}/></svg>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm">MyScoreNova</p>
              <p className="text-xs" style={{color:'#4db2b2'}}>Watchtower</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 mb-6 rounded-xl" style={{background:'rgba(244,176,0,0.12)',border:'1px solid rgba(244,176,0,0.2)'}}>
            <Shield size={13} style={{color:'#F4B000'}} className="shrink-0"/>
            <span className="text-xs font-medium" style={{color:'#F4B000'}}>Read-only mode</span>
          </div>
          <nav className="space-y-1">
            <NavLink to="/admin" end style={({isActive})=>isActive
              ?{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',borderRadius:'12px',fontSize:'14px',fontWeight:'500',background:'rgba(255,255,255,0.1)',color:'white'}
              :{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',borderRadius:'12px',fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.5)'}}>
              <LayoutDashboard size={18}/> All participants
            </NavLink>
          </nav>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{background:'rgba(255,255,255,0.05)'}}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{background:TEAL,color:'white'}}>AD</div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{color:'rgba(255,255,255,0.4)'}}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all hover:opacity-100" style={{color:'rgba(255,255,255,0.4)'}}>
            <LogOut size={16}/> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col w-full">
        {/* Mobile Header - Fixed */}
        <div className="flex items-center justify-between p-4 sticky top-0 z-40" style={{background:NAVY}}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background:TEAL}}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10" r="2.5" fill={PGREEN}/></svg>
            </div>
            <p className="font-bold text-white text-xs">MyScoreNova</p>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu - Sliding Panel */}
        <div className={`fixed left-0 top-20 bottom-0 w-60 z-50 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} style={{background:NAVY}}>
          <div className="p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 px-3 py-2 mb-6 rounded-xl" style={{background:'rgba(244,176,0,0.12)',border:'1px solid rgba(244,176,0,0.2)'}}>
                <Shield size={13} style={{color:'#F4B000'}} className="shrink-0"/>
                <span className="text-xs font-medium" style={{color:'#F4B000'}}>Read-only mode</span>
              </div>
              <nav className="space-y-1">
                <NavLink to="/admin" end onClick={() => setMobileMenuOpen(false)} style={({isActive})=>isActive
                  ?{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',borderRadius:'12px',fontSize:'14px',fontWeight:'500',background:'rgba(255,255,255,0.1)',color:'white'}
                  :{display:'flex',alignItems:'center',gap:'12px',padding:'10px 12px',borderRadius:'12px',fontSize:'14px',fontWeight:'500',color:'rgba(255,255,255,0.5)'}}>
                  <LayoutDashboard size={18}/> All participants
                </NavLink>
              </nav>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{background:'rgba(255,255,255,0.05)'}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium" style={{background:TEAL,color:'white'}}>AD</div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs truncate" style={{color:'rgba(255,255,255,0.4)'}}>{user?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-all hover:opacity-100" style={{color:'rgba(255,255,255,0.4)'}}>
                <LogOut size={16}/> Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Backdrop - Closes menu when clicked */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 top-20 z-40 lg:hidden" 
            style={{background:'rgba(0,0,0,0.3)'}}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Main Content */}
        <main className="flex-1 min-w-0 overflow-y-auto">
          <Outlet/>
        </main>
      </div>

      {/* Desktop Main Content */}
      <main className="hidden lg:flex flex-1 min-w-0"><Outlet/></main>
    </div>
  )
}