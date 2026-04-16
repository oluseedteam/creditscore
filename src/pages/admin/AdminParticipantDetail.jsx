import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, TrendingUp, BookOpen, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'
import { format } from 'date-fns'

export default function AdminParticipantDetail() {
  const { id } = useParams()
  const { getAllUsers } = useAuth()
  const users = getAllUsers()
  const user = users.find(u => u.id === id)

  if (!user) return (
    <div className="p-10 text-center">
      <p className="text-navy-800/50">Participant not found.</p>
      <Link to="/admin" className="btn-secondary mt-4 inline-flex">← Back to dashboard</Link>
    </div>
  )

  const history = user.creditHistory || []
  const latest = history[history.length - 1]
  const status = latest ? getStatusFromScore(latest.score) : null
  const attPct = user.attendance?.total > 0 ? Math.round((user.attendance.attended / user.attendance.total) * 100) : 0
  const delta = history.length >= 2 ? history[history.length - 1].score - history[0].score : null
  const pct = latest ? Math.round(((latest.score - 300) / 550) * 100) : 0
  const barColor = status?.color === 'green' ? '#1a9464' : status?.color === 'yellow' ? '#d97706' : '#dc2626'
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  const chartData = history.map(h => ({
    month: format(new Date(h.month + '-01'), 'MMM yy'),
    score: h.score,
  }))

  const StatusIcon = status?.color === 'green' ? CheckCircle : status?.color === 'yellow' ? AlertTriangle : XCircle

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-navy-800/60 hover:text-navy-900 transition-colors mb-8 group">
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to all participants
      </Link>

      {/* Header */}
      <div className="card p-6 mb-6 flex items-center gap-5 flex-wrap">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-medium shrink-0 ${
          status?.color === 'green'  ? 'bg-forest-100 text-forest-800' :
          status?.color === 'yellow' ? 'bg-amber-100 text-amber-800'  :
          status?.color === 'red'    ? 'bg-red-100 text-red-800'      : 'bg-cream-200 text-navy-800/40'
        }`}>{initials}</div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold text-navy-900 mb-0.5">{user.name}</h1>
          <p className="text-navy-800/50 text-sm">{user.email} · Joined {format(new Date(user.joined), 'MMMM d, yyyy')}</p>
        </div>
        {status && (
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
            status.color === 'green' ? 'bg-forest-100 text-forest-800' :
            status.color === 'yellow' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
          }`}>
            <StatusIcon size={16} /> {status.label}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Credit score panel */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={18} className="text-forest-600" />
            <h2 className="font-display font-semibold text-navy-900">Credit score</h2>
          </div>
          {latest ? (
            <>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display text-5xl font-bold text-navy-900">{latest.score}</span>
                {delta !== null && (
                  <span className={`text-sm font-medium ${delta >= 0 ? 'text-forest-600' : 'text-red-600'}`}>
                    {delta >= 0 ? '+' : ''}{delta} since start
                  </span>
                )}
              </div>
              <div className="h-3 bg-cream-200 rounded-full overflow-hidden mb-1.5">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
              </div>
              <div className="flex justify-between text-[11px] text-navy-800/40 mb-4">
                <span>300</span><span>580</span><span>670</span><span>850</span>
              </div>
              <p className="text-xs text-navy-800/50">
                Last updated: {format(new Date(latest.month + '-01'), 'MMMM yyyy')}
                {latest.note && ` · "${latest.note}"`}
              </p>
            </>
          ) : (
            <p className="text-navy-800/40 text-sm">No credit score submitted yet.</p>
          )}
        </div>

        {/* Attendance panel */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen size={18} className="text-forest-600" />
            <h2 className="font-display font-semibold text-navy-900">Class attendance</h2>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="font-display text-5xl font-bold text-navy-900">{attPct}%</span>
            <span className="text-navy-800/50 text-sm">{user.attendance?.attended}/{user.attendance?.total} classes</span>
          </div>
          <div className="h-3 bg-cream-200 rounded-full overflow-hidden mb-2">
            <div className={`h-full rounded-full ${attPct >= 75 ? 'bg-forest-500' : attPct >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
              style={{ width: `${attPct}%` }} />
          </div>
          <p className={`text-xs mt-2 ${attPct >= 75 ? 'text-forest-600' : 'text-amber-600'}`}>
            {attPct >= 75 ? 'Meeting attendance requirement (75%+)' : `Below 75% requirement — ${75 - attPct}% gap`}
          </p>
        </div>
      </div>

      {/* Score history chart */}
      {chartData.length >= 2 && (
        <div className="card p-6 mb-6">
          <h2 className="font-display font-semibold text-navy-900 mb-6">Score trajectory</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis domain={[300, 850]} tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip formatter={(v) => [v, 'Score']} />
              <ReferenceLine y={670} stroke="#1a9464" strokeDasharray="4 4" strokeOpacity={0.4} label={{ value: 'Good', position: 'right', fontSize: 10, fill: '#1a9464' }} />
              <ReferenceLine y={580} stroke="#d97706" strokeDasharray="4 4" strokeOpacity={0.4} />
              <Line type="monotone" dataKey="score" stroke={barColor} strokeWidth={2.5}
                dot={{ r: 5, fill: barColor, strokeWidth: 0 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Full history */}
      {history.length > 0 && (
        <div className="card overflow-hidden mb-6">
          <div className="p-5 border-b border-cream-200">
            <h2 className="font-display font-semibold text-navy-900">Full score history</h2>
          </div>
          <div className="divide-y divide-cream-100">
            {[...history].reverse().map((entry, i) => {
              const s = getStatusFromScore(entry.score)
              const Icon = s.color === 'green' ? CheckCircle : s.color === 'yellow' ? AlertTriangle : XCircle
              return (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-cream-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-navy-800/30" />
                    <div>
                      <p className="text-sm font-medium text-navy-900">{format(new Date(entry.month + '-01'), 'MMMM yyyy')}</p>
                      {entry.note && <p className="text-xs text-navy-800/50">{entry.note}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      s.color === 'green' ? 'bg-forest-100 text-forest-700' :
                      s.color === 'yellow' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      <Icon size={11} /> {s.label}
                    </span>
                    <span className="font-mono font-medium text-navy-900 text-sm">{entry.score}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Admin notes banner */}
      <div className="card p-5 bg-amber-50 border-amber-200 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>
        </div>
        <div>
          <p className="text-amber-900 font-medium text-sm mb-0.5">Read-only access</p>
          <p className="text-amber-800/70 text-xs">You are viewing this participant's data in read-only mode. Only the participant can edit their own profile and credit history.</p>
        </div>
      </div>
    </div>
  )
}
