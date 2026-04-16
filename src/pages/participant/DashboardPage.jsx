import { Link } from 'react-router-dom'
import { TrendingUp, BookOpen, Key, ArrowRight, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'

function ScoreStatusIcon({ color }) {
  if (color === 'green')  return <CheckCircle size={18} className="text-forest-600" />
  if (color === 'yellow') return <AlertTriangle size={18} className="text-amber-600" />
  return <XCircle size={18} className="text-red-600" />
}

export default function DashboardPage() {
  const { user } = useAuth()
  const history = user?.creditHistory || []
  const latest = history[history.length - 1]
  const previous = history[history.length - 2]
  const status = latest ? getStatusFromScore(latest.score) : null
  const delta = latest && previous ? latest.score - previous.score : null
  const pct = latest ? Math.round(((latest.score - 300) / 550) * 100) : 0
  const attendancePct = user?.attendance?.total > 0
    ? Math.round((user.attendance.attended / user.attendance.total) * 100) : 0

  const barColor = status?.color === 'green' ? '#1a9464' : status?.color === 'yellow' ? '#d97706' : '#dc2626'

  const quickLinks = [
    { to: '/credit-score',   icon: TrendingUp, label: 'Update credit score', desc: 'Add your monthly score', color: 'forest' },
    { to: '/class-progress', icon: BookOpen,   label: 'Class progress',       desc: `${attendancePct}% attendance`, color: 'navy' },
    { to: '/loan-gateway',   icon: Key,        label: 'Loan gateway',         desc: status?.color === 'green' ? 'Unlocked!' : 'Locked', color: status?.color === 'green' ? 'forest' : 'cream' },
  ]

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-1">
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-navy-800/60">Here's your homeownership progress at a glance.</p>
      </div>

      {/* Credit score hero card */}
      {latest ? (
        <div className={`card p-8 mb-6 relative overflow-hidden ${status?.color === 'green' ? 'border-forest-200' : status?.color === 'yellow' ? 'border-amber-200' : 'border-red-200'}`}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"
            style={{ background: status?.color === 'green' ? 'rgba(26,148,100,0.06)' : status?.color === 'yellow' ? 'rgba(217,119,6,0.06)' : 'rgba(220,38,38,0.06)' }} />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div>
                <p className="text-sm text-navy-800/50 mb-1">Your latest credit score</p>
                <div className="flex items-baseline gap-3">
                  <span className="font-display text-6xl font-bold text-navy-900">{latest.score}</span>
                  {delta !== null && (
                    <span className={`text-sm font-medium ${delta >= 0 ? 'text-forest-600' : 'text-red-600'}`}>
                      {delta >= 0 ? '+' : ''}{delta} pts
                    </span>
                  )}
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                status?.color === 'green' ? 'bg-forest-100 text-forest-800' :
                status?.color === 'yellow' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                <ScoreStatusIcon color={status?.color} />
                {status?.label}
              </div>
            </div>

            <div className="mb-2">
              <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${pct}%`, background: barColor }} />
              </div>
              <div className="flex justify-between mt-1.5 text-[11px] text-navy-800/40">
                <span>300 — Bad</span><span>580 — Low</span><span>670 — Good</span><span>850</span>
              </div>
            </div>
            <p className="text-sm text-navy-800/60 mt-4">{status?.description}</p>
          </div>
        </div>
      ) : (
        <div className="card p-8 mb-6 border-dashed border-2 border-cream-300 text-center">
          <TrendingUp className="mx-auto text-forest-400 mb-3" size={32} />
          <h3 className="font-display font-semibold text-navy-900 mb-1">No credit score yet</h3>
          <p className="text-sm text-navy-800/60 mb-4">Add your first monthly credit score to get started.</p>
          <Link to="/credit-score" className="btn-primary inline-flex">Add first score <ArrowRight size={16} /></Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Score entries', value: history.length, sub: 'months tracked' },
          { label: 'Attendance', value: `${attendancePct}%`, sub: `${user?.attendance?.attended}/${user?.attendance?.total} classes` },
          { label: 'Score change', value: history.length >= 2 ? `${latest.score - history[0].score > 0 ? '+' : ''}${latest.score - history[0].score}` : '—', sub: 'since start' },
          { label: 'Loan status', value: status?.color === 'green' ? '🔓' : '🔒', sub: status?.color === 'green' ? 'Unlocked' : 'Locked' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <p className="text-xs text-navy-800/50 mb-1">{s.label}</p>
            <p className="font-display text-2xl font-bold text-navy-900">{s.value}</p>
            <p className="text-xs text-navy-800/40 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h2 className="font-display text-lg font-semibold text-navy-900 mb-4">Quick actions</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {quickLinks.map(({ to, icon: Icon, label, desc }) => (
          <Link key={to} to={to} className="card-hover p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center group-hover:bg-forest-200 transition-colors shrink-0">
              <Icon size={18} className="text-forest-700" />
            </div>
            <div className="min-w-0">
              <p className="font-medium text-navy-900 text-sm">{label}</p>
              <p className="text-xs text-navy-800/50">{desc}</p>
            </div>
            <ArrowRight size={16} className="text-navy-800/30 ml-auto shrink-0 group-hover:text-forest-600 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  )
}
