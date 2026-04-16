import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, BookOpen, Key, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const nav = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/credit-score',   icon: TrendingUp,      label: 'Credit Score' },
  { to: '/class-progress', icon: BookOpen,        label: 'Class Progress' },
  { to: '/loan-gateway',   icon: Key,             label: 'Loan Gateway' },
]

export default function ParticipantLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = ({ mobile }) => (
    <aside className={clsx(
      'flex flex-col justify-between bg-white border-r border-cream-200',
      mobile ? 'w-64 h-full p-6' : 'w-64 min-h-screen p-6 hidden lg:flex'
    )}>
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="2.5" fill="white"/></svg>
          </div>
          <span className="font-display font-semibold text-navy-900 text-base">Path to Ownership</span>
        </div>
        <nav className="space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
              className={({ isActive }) => clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                isActive
                  ? 'bg-forest-50 text-forest-700 border border-forest-100'
                  : 'text-navy-800/60 hover:text-navy-800 hover:bg-cream-100'
              )}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-4 p-3 bg-cream-100 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-forest-200 flex items-center justify-center text-forest-800 text-xs font-medium">
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0,2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-navy-900 truncate">{user?.name}</p>
            <p className="text-xs text-navy-800/50 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-navy-800/50 hover:text-red-600 hover:bg-red-50 transition-all">
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex min-h-screen bg-cream-50">
      <Sidebar />

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-cream-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-forest-600 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="2.5" fill="white"/></svg>
          </div>
          <span className="font-display font-semibold text-navy-900 text-sm">Path to Ownership</span>
        </div>
        <button onClick={() => setMobileOpen(s => !s)} className="p-2 rounded-lg hover:bg-cream-100 transition-colors">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex" onClick={() => setMobileOpen(false)}>
          <div className="bg-black/20 flex-1" />
          <div onClick={e => e.stopPropagation()}>
            <Sidebar mobile />
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 lg:pt-0 pt-14">
        <Outlet />
      </main>
    </div>
  )
}
