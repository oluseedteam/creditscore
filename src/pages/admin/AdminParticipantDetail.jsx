import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, TrendingUp, BookOpen, Calendar, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell, AreaChart, Area } from 'recharts'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'
import { format } from 'date-fns'

// Consistent Theme Colors
const NAVY='#102A43', PGREEN='#2FBF71', GOLD='#F4B000', CORAL='#F56A6A', TEAL='#066A6F'

export default function AdminParticipantDetail() {
  const { id } = useParams()
  const { getAllUsers } = useAuth()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllUsers().then(users => {
      const u = (users || []).find(u => String(u.id) === String(id))
      setUser(u)
      setLoading(false)
    })
  }, [id, getAllUsers])

  if (loading) return <div className="p-10 text-center text-gray-500">Loading profile...</div>

  if (!user) return (
    <div className="p-10 text-center">
      <p style={{color: '#6B7280'}}>Participant not found.</p>
      <Link to="/admin" className="btn-secondary mt-4 inline-flex">← Back to dashboard</Link>
    </div>
  )


  const history = user.creditHistory || []
  const latest = history[history.length - 1]
  const status = latest ? getStatusFromScore(latest.score) : null
  const attPct = user.attendance?.total > 0 ? Math.round((user.attendance.attended / user.attendance.total) * 100) : 0
  const delta = history.length >= 2 ? history[history.length - 1].score - history[0].score : null
  const pct = latest ? Math.round(((latest.score - 300) / 550) * 100) : 0
  const barColor = status?.color === 'green' ? PGREEN : status?.color === 'yellow' ? GOLD : CORAL
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2)

  // Data for Trajectory (AreaChart)
  const chartData = history.map(h => ({
    month: format(new Date(h.month + '-01'), 'MMM yy'),
    score: h.score,
  }))

  // Data for Monthly Gains/Losses (BarChart)
  const deltaData = history.slice(1).map((h, i) => ({
    month: format(new Date(h.month + '-01'), 'MMM yy'),
    change: h.score - history[i].score,
  }))

  const StatusIcon = status?.color === 'green' ? CheckCircle : status?.color === 'yellow' ? AlertTriangle : XCircle

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-medium transition-colors mb-4 group" style={{color: '#6B7280'}}>
        <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to all participants
      </Link>

      {/* Participant Header Card */}
      <div className="card p-6 flex items-center gap-6 flex-wrap">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shrink-0 text-white shadow-lg" 
             style={{ background: barColor }}>
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-2xl font-bold mb-0.5" style={{color: NAVY}}>{user.name}</h1>
          <p className="text-sm font-medium" style={{color: '#6B7280'}}>{user.email} · Joined {format(new Date(user.joined), 'MMM yyyy')}</p>
        </div>
        {status && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm"
               style={{ background: `${barColor}15`, color: barColor, border: `1px solid ${barColor}30` }}>
            <StatusIcon size={16} /> {status.label}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Metric 1: Credit Score Overview */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} style={{color: TEAL}} />
              <h2 className="font-display font-semibold text-sm uppercase tracking-widest" style={{color: NAVY}}>Credit Position</h2>
            </div>
            {latest ? (
              <>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-display text-5xl font-bold" style={{color: NAVY}}>{latest.score}</span>
                  {delta !== null && (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${delta >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)} pts
                    </span>
                  )}
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-full" style={{ width: `${pct}%`, background: barColor }} />
                </div>
                <p className="text-[10px] font-bold uppercase" style={{color: '#6B7280'}}>Last reported: {format(new Date(latest.month + '-01'), 'MMM yyyy')}</p>
              </>
            ) : <p className="text-sm text-gray-400 italic">No score reported</p>}
          </div>
        </div>

        {/* Metric 2: Attendance Velocity */}
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} style={{color: TEAL}} />
              <h2 className="font-display font-semibold text-sm uppercase tracking-widest" style={{color: NAVY}}>Class Engagement</h2>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-display text-5xl font-bold" style={{color: NAVY}}>{attPct}%</span>
              <span className="text-xs font-bold text-gray-400">{user.attendance?.attended}/{user.attendance?.total}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
              <div className="h-full" style={{ width: `${attPct}%`, background: attPct >= 75 ? PGREEN : GOLD }} />
            </div>
            <p className="text-[10px] font-bold uppercase" style={{color: attPct >= 75 ? PGREEN : CORAL}}>
              {attPct >= 75 ? 'Qualified for Grant' : `${75 - attPct}% below requirement`}
            </p>
          </div>
        </div>

        {/* Metric 3: Profile Completion */}
        <div className="card p-6 bg-gray-50/50 border-dashed border-2 flex items-center justify-center text-center">
            <div>
                <BarChart3 className="mx-auto mb-2 text-gray-300" size={32} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Snapshot</p>
                <p className="text-xs font-medium text-gray-500">History: {history.length} months</p>
            </div>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chart 1: Trajectory */}
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="font-display font-bold" style={{color: NAVY}}>Score Trajectory</h3>
            <p className="text-xs font-medium text-gray-400 italic">Visualizing growth against the 670 "Good" threshold</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={barColor} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={barColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis domain={[300, 850]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <ReferenceLine y={670} stroke={PGREEN} strokeDasharray="4 4" strokeOpacity={0.5} label={{ value: 'Grant Eligible', position: 'insideTopRight', fontSize: 9, fill: PGREEN, fontWeight: 'bold' }} />
              <Area type="monotone" dataKey="score" stroke={barColor} strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" 
                    dot={{ r: 4, fill: barColor, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Point Velocity */}
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="font-display font-bold" style={{color: NAVY}}>Monthly Velocity</h3>
            <p className="text-xs font-medium text-gray-400 italic">Net point changes per reporting period</p>
          </div>
          {deltaData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deltaData} margin={{ top: 5, right: 10, bottom: 0, left: -25 }}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} formatter={(v) => [`${v > 0 ? '+' : ''}${v} pts`, 'Change']} />
                <ReferenceLine y={0} stroke="#e2e8f0" />
                <Bar dataKey="change" radius={[4, 4, 0, 0]}>
                  {deltaData.map((d, i) => (
                    <Cell key={i} fill={d.change >= 0 ? PGREEN : CORAL} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center bg-gray-50 rounded-xl border border-dashed">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Insufficient history for velocity</p>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b" style={{borderColor: '#E3E6EC'}}>
          <h2 className="font-display font-bold italic uppercase tracking-tight text-sm" style={{color: NAVY}}>Reporting History</h2>
        </div>
        <div className="divide-y" style={{borderColor: '#F1F5F9'}}>
          {[...history].reverse().map((entry, i) => {
            const s = getStatusFromScore(entry.score)
            const iconColor = s.color === 'green' ? PGREEN : s.color === 'yellow' ? GOLD : CORAL
            return (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-gray-100 shadow-sm">
                    <Calendar size={14} style={{color: '#94a3b8'}} />
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{color: NAVY}}>{format(new Date(entry.month + '-01'), 'MMMM yyyy')}</p>
                    {entry.note && <p className="text-xs font-medium" style={{color: '#6B7280'}}>{entry.note}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black uppercase tracking-tighter" style={{ color: iconColor }}>{s.label}</span>
                  <span className="font-mono font-bold text-lg" style={{color: NAVY}}>{entry.score}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Admin Notice */}
      <div className="card p-4 border-none shadow-sm flex items-center gap-4" style={{background: '#FFFBEB', border: `1px solid ${GOLD}40`}}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm" style={{background: GOLD}}>
          <AlertTriangle size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{color: '#92400E'}}>Read-Only Protocol</p>
          <p className="text-xs font-medium" style={{color: '#B45309'}}>You are viewing sensitive participant data. Modifications must be handled by the user or via high-level database overrides.</p>
        </div>
      </div>
    </div>
  )
}