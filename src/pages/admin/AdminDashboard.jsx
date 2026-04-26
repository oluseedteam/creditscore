import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, CheckCircle, AlertTriangle, XCircle, Users, TrendingUp, Award, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'

// Theme Constants - Aligned with your specific palette
const NAVY = '#102A43'
const PGREEN = '#2FBF71' // Ready
const GOLD = '#F4B000'   // At Risk
const CORAL = '#F56A6A'  // Critical
const TEAL = '#066A6F'

function StatusBadge({ color, label }) {
  const styles = {
    green: { bg: `${PGREEN}15`, text: PGREEN, icon: CheckCircle },
    yellow: { bg: `${GOLD}15`, text: GOLD, icon: AlertTriangle },
    red: { bg: `${CORAL}15`, text: CORAL, icon: XCircle },
    gray: { bg: '#F1F5F9', text: '#64748b', icon: Activity }
  }
  const theme = styles[color] || styles.gray
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" 
          style={{ backgroundColor: theme.bg, color: theme.text }}>
      <theme.icon size={12} />
      {label}
    </span>
  )
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
  }

  // Chart Data: Distribution
  const distData = [
    { name: 'Ready', count: counts.green, color: PGREEN },
    { name: 'At Risk', count: counts.yellow, color: GOLD },
    { name: 'Critical', count: counts.red, color: CORAL },
  ]

  const avgScore = enriched.filter(u => u.latest).length > 0
    ? Math.round(enriched.filter(u => u.latest).reduce((sum, u) => sum + u.latest.score, 0) / enriched.filter(u => u.latest).length)
    : null

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight mb-2" style={{color: NAVY}}>Watchtower</h1>
        <p className="font-medium opacity-60" style={{color: NAVY}}>Portfolio monitoring and cohort analytics.</p>
      </div>

      {/* Primary Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="card p-6 border-l-4" style={{borderLeftColor: TEAL}}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total Cohort</p>
            <p className="text-4xl font-bold" style={{color: NAVY}}>{counts.all}</p>
          </div>
          <div className="card p-6 border-l-4" style={{borderLeftColor: PGREEN}}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Avg. Credit Score</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold" style={{color: NAVY}}>{avgScore || '—'}</p>
              <TrendingUp size={16} style={{color: PGREEN}} />
            </div>
          </div>
        </div>

        <div className="card p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Status Distribution</h3>
            <div className="flex gap-4">
               {distData.map(d => (
                 <div key={d.name} className="flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full" style={{background: d.color}} />
                   <span className="text-[10px] font-bold text-gray-500 uppercase">{d.name}</span>
                 </div>
               ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={distData} layout="vertical" margin={{ left: -20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" hide />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                {distData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toolbar - Functional Filter Labels with Color Dots */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 transition-all" 
            placeholder="Search name or email..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-auto gap-1">
          {[
            { key: 'all', label: 'All', color: null },
            { key: 'green', label: 'Ready', color: PGREEN },
            { key: 'yellow', label: 'At Risk', color: GOLD },
            { key: 'red', label: 'Critical', color: CORAL },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                filter === f.key ? 'bg-white shadow-sm text-navy-900' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {f.color && <span className="w-2 h-2 rounded-full" style={{ background: f.color }} />}
              {f.label}
              <span className="opacity-40 ml-1">
                ({f.key === 'all' ? counts.all : counts[f.key]})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Participant List */}
      <div className="card overflow-hidden border-none shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Participant</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Performance</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm"
                           style={{ background: u.status.color === 'gray' ? '#cbd5e1' : 
                                              u.status.color === 'green' ? PGREEN : 
                                              u.status.color === 'yellow' ? GOLD : CORAL }}>
                        {u.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{color: NAVY}}>{u.name}</p>
                        <p className="text-[10px] font-medium text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge color={u.status.color} label={u.status.label} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Score</p>
                        <div className="flex items-center gap-2">
                           <span className="font-mono font-bold text-sm" style={{color: NAVY}}>{u.latest?.score || '—'}</span>
                           {u.delta !== null && (
                             <span className="text-[10px] font-black" style={{color: u.delta >= 0 ? PGREEN : CORAL}}>
                               {u.delta >= 0 ? '▲' : '▼'}{Math.abs(u.delta)}
                             </span>
                           )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Attendance</p>
                        <span className={`text-sm font-bold ${u.attPct >= 75 ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {u.attPct}%
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/admin/participant/${u.id}`} 
                          className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-lg bg-gray-100 group-hover:bg-navy-900 group-hover:text-white transition-all">
                      Analysis
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
             <div className="p-20 text-center">
                <Users size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No participants found</p>
             </div>
          )}
        </div>
      </div>

      {/* Loan-ready Action Banner */}
      {counts.green > 0 && (
        <div className="bg-emerald-600 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-900/20">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Award size={24} />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">{counts.green} Participants "Ready" for deployment</p>
              <p className="text-sm text-emerald-100 font-medium opacity-80">Eligible for loan officer assignment based on credit performance.</p>
            </div>
          </div>
          <button onClick={() => setFilter('green')} className="whitespace-nowrap px-6 py-3 bg-white text-emerald-700 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors">
            Review Deployments
          </button>
        </div>
      )}
    </div>
  )
}