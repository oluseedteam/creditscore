import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="flex min-h-screen bg-cream-50">
      <aside className="w-60 min-h-screen p-6 bg-navy-900 flex flex-col justify-between hidden lg:flex">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="2.5" fill="white"/></svg>
            </div>
            <div>
              <p className="font-display font-semibold text-white text-sm">Watchtower</p>
              <p className="text-forest-400 text-xs">Admin console</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 mb-6 bg-amber-900/30 border border-amber-700/30 rounded-xl">
            <Shield size={13} className="text-amber-400 shrink-0" />
            <span className="text-amber-300 text-xs">Read-only mode</span>
          </div>
          <nav className="space-y-1">
            <NavLink to="/admin" end
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
              <LayoutDashboard size={18} /> All participants
            </NavLink>
          </nav>
        </div>
        <div>
          <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-forest-800 flex items-center justify-center text-forest-300 text-xs font-medium">AD</div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-white/40 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-900/20 transition-all">
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0"><Outlet /></main>
    </div>
  )
}
