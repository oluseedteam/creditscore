import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ArrowRight, CheckCircle, AlertTriangle, XCircle, Users, TrendingUp, Award } from 'lucide-react'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'
import { format } from 'date-fns'

function StatusBadge({ color, label }) {
  const cls = color === 'green' ? 'badge-green' : color === 'yellow' ? 'badge-yellow' : 'badge-red'
  const Icon = color === 'green' ? CheckCircle : color === 'yellow' ? AlertTriangle : XCircle
  return <span className={cls}><Icon size={12} />{label}</span>
}

export default function AdminDashboard() {
  const { getAllUsers } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const users = getAllUsers()

  const enriched = useMemo(() => users.map(u => {
    const latest = u.creditHistory?.[u.creditHistory.length - 1]
    const status = latest ? getStatusFromScore(latest.score) : { label: 'No data', color: 'gray' }
    const attPct = u.attendance?.total > 0 ? Math.round((u.attendance.attended / u.attendance.total) * 100) : 0
    const delta = u.creditHistory?.length >= 2
      ? u.creditHistory[u.creditHistory.length - 1].score - u.creditHistory[0].score : null
    return { ...u, latest, status, attPct, delta }
  }), [users])

  const filtered = useMemo(() => enriched.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status.color === filter
    return matchSearch && matchFilter
  }), [enriched, search, filter])

  const counts = {
    all: enriched.length,
    green: enriched.filter(u => u.status.color === 'green').length,
    yellow: enriched.filter(u => u.status.color === 'yellow').length,
    red: enriched.filter(u => u.status.color === 'red').length,
    nodata: enriched.filter(u => u.status.color === 'gray').length,
  }

  const avgScore = enriched.filter(u => u.latest).length > 0
    ? Math.round(enriched.filter(u => u.latest).reduce((sum, u) => sum + u.latest.score, 0) / enriched.filter(u => u.latest).length)
    : null

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-1">Watchtower</h1>
        <p className="text-navy-800/60">Full cohort overview — read-only view of all participants.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-xs text-navy-800/50 mb-1">Total participants</p>
          <p className="font-display text-3xl font-bold text-navy-900">{counts.all}</p>
        </div>
        <div className="card p-4 border-forest-100">
          <p className="text-xs text-forest-700 mb-1">Loan-ready (green)</p>
          <p className="font-display text-3xl font-bold text-forest-700">{counts.green}</p>
        </div>
        <div className="card p-4 border-amber-100">
          <p className="text-xs text-amber-700 mb-1">At risk (yellow)</p>
          <p className="font-display text-3xl font-bold text-amber-700">{counts.yellow}</p>
        </div>
        <div className="card p-4 border-red-100">
          <p className="text-xs text-red-700 mb-1">Critical (red)</p>
          <p className="font-display text-3xl font-bold text-red-700">{counts.red}</p>
        </div>
      </div>

      {avgScore && (
        <div className="card p-5 mb-6 flex items-center gap-5 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center"><TrendingUp size={18} className="text-forest-700" /></div>
            <div>
              <p className="text-xs text-navy-800/50">Cohort avg. score</p>
              <p className="font-display text-2xl font-bold text-navy-900">{avgScore}</p>
            </div>
          </div>
          <div className="flex-1 min-w-48">
            <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
              <div className="h-full bg-forest-400 rounded-full" style={{ width: `${Math.round(((avgScore - 300) / 550) * 100)}%` }} />
            </div>
            <div className="flex justify-between mt-1 text-[10px] text-navy-800/40">
              <span>300</span><span>580</span><span>670</span><span>850</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-800/40" />
          <input className="input-field pl-9 text-sm" placeholder="Search participants..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'all',    label: `All (${counts.all})` },
            { key: 'green',  label: `Ready (${counts.green})` },
            { key: 'yellow', label: `At risk (${counts.yellow})` },
            { key: 'red',    label: `Critical (${counts.red})` },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                filter === f.key
                  ? f.key === 'green' ? 'bg-forest-100 text-forest-800 border-forest-200'
                  : f.key === 'yellow' ? 'bg-amber-100 text-amber-800 border-amber-200'
                  : f.key === 'red' ? 'bg-red-100 text-red-800 border-red-200'
                  : 'bg-navy-900 text-white border-navy-900'
                  : 'bg-white text-navy-800/60 border-cream-200 hover:border-cream-300'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_80px] p-4 border-b border-cream-200 text-xs text-navy-800/50 uppercase tracking-wider">
          <span>Participant</span>
          <span>Status</span>
          <span>Latest score</span>
          <span>Attendance</span>
          <span></span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="mx-auto text-cream-300 mb-3" size={36} />
            <p className="text-navy-800/50 text-sm">No participants match this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-cream-100">
            {filtered.map(u => (
              <div key={u.id} className="grid lg:grid-cols-[2fr_1fr_1fr_1fr_80px] p-4 items-center gap-4 hover:bg-cream-50 transition-colors">
                {/* Participant */}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium shrink-0 ${
                    u.status.color === 'green'  ? 'bg-forest-100 text-forest-800' :
                    u.status.color === 'yellow' ? 'bg-amber-100 text-amber-800'  :
                    u.status.color === 'red'    ? 'bg-red-100 text-red-800'      : 'bg-cream-200 text-navy-800/50'
                  }`}>
                    {u.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p className="font-medium text-navy-900 text-sm">{u.name}</p>
                    <p className="text-xs text-navy-800/50">{u.email}</p>
                  </div>
                </div>

                {/* Status */}
                <div>
                  {u.status.color !== 'gray'
                    ? <StatusBadge color={u.status.color} label={u.status.label} />
                    : <span className="text-xs text-navy-800/40">No data</span>
                  }
                </div>

                {/* Score */}
                <div>
                  {u.latest ? (
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-medium text-navy-900">{u.latest.score}</span>
                        {u.delta !== null && (
                          <span className={`text-xs ${u.delta >= 0 ? 'text-forest-600' : 'text-red-600'}`}>
                            {u.delta >= 0 ? '+' : ''}{u.delta}
                          </span>
                        )}
                      </div>
                      <div className="w-20 h-1.5 bg-cream-200 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full rounded-full" style={{
                          width: `${Math.round(((u.latest.score - 300) / 550) * 100)}%`,
                          background: u.status.color === 'green' ? '#1a9464' : u.status.color === 'yellow' ? '#d97706' : '#dc2626'
                        }} />
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-navy-800/40">—</span>
                  )}
                </div>

                {/* Attendance */}
                <div>
                  <span className={`text-sm font-medium ${u.attPct >= 75 ? 'text-forest-700' : u.attPct >= 50 ? 'text-amber-700' : 'text-red-700'}`}>
                    {u.attPct}%
                  </span>
                  <p className="text-xs text-navy-800/40">{u.attendance?.attended}/{u.attendance?.total} classes</p>
                </div>

                {/* Action */}
                <Link to={`/admin/participant/${u.id}`} className="flex items-center gap-1 text-xs font-medium text-forest-600 hover:text-forest-800 transition-colors group">
                  View <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Loan-ready alert */}
      {counts.green > 0 && (
        <div className="mt-6 card p-5 border-forest-200 bg-forest-50 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-forest-200 flex items-center justify-center shrink-0">
            <Award size={18} className="text-forest-800" />
          </div>
          <div>
            <p className="font-medium text-forest-900 mb-0.5">
              {counts.green} participant{counts.green > 1 ? 's' : ''} ready for loan origination
            </p>
            <p className="text-sm text-forest-800/70">
              These participants have reached Good credit status. Initiate loan officer assignments to move them forward.
            </p>
          </div>
          <button onClick={() => setFilter('green')} className="shrink-0 text-xs font-medium text-forest-700 border border-forest-300 px-3 py-1.5 rounded-lg hover:bg-forest-100 transition-colors">
            View ready
          </button>
        </div>
      )}
    </div>
  )
}
