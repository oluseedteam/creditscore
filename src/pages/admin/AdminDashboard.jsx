import { useState, useMemo, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, CheckCircle, AlertTriangle, XCircle, Users, TrendingUp, Award, Activity, Trash2, ShieldAlert, UserCheck, UserMinus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { useDialog } from '../../context/DialogContext'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

// Theme Constants
const NAVY = '#102A43', PGREEN = '#2FBF71', GOLD = '#F4B000', CORAL = '#F56A6A', TEAL = '#066A6F'

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
  const { getAllUsers, api } = useAuth()
  const { showDialog } = useDialog()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [users, setUsers] = useState([])

  const fetchUsers = useCallback(() => {
    getAllUsers().then(data => setUsers(data || []))
  }, [getAllUsers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const deleteUser = (id, name) => {
    showDialog({
      title: 'Delete Participant',
      message: `Are you sure you want to permanently delete ${name}? This action cannot be undone.`,
      confirmLabel: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/users/${id}`)
          toast.success('User removed')
          fetchUsers()
        } catch { toast.error('Failed to delete user') }
      }
    })
  }

  const toggleSuspend = (id, currentStatus, name) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    showDialog({
      title: newStatus === 'suspended' ? 'Suspend Participant' : 'Activate Participant',
      message: `Change ${name}'s account status to ${newStatus}?`,
      confirmLabel: 'Confirm',
      type: newStatus === 'suspended' ? 'warning' : 'success',
      onConfirm: async () => {
        try {
          await api.patch(`/users/${id}/status`, { status: newStatus })
          toast.success(`User ${newStatus}`)
          fetchUsers()
        } catch { toast.error('Status update failed') }
      }
    })
  }

  const enriched = useMemo(() => users.map(u => {
    const latest = u.creditHistory?.[u.creditHistory.length - 1]
    const creditScore = latest?.score || 0
    const results = u.cbtResults || []
    const totalPossible = results.reduce((sum, r) => sum + (r.total_questions || 0), 0)
    const totalEarned = results.reduce((sum, r) => sum + (r.score || 0), 0)
    const cbtAvg = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : null

    let status = { label: 'No Data', color: 'gray' }
    if (u.status === 'suspended') {
      status = { label: 'Suspended', color: 'red' }
    } else if (creditScore > 0) {
      if (creditScore >= 670 && (cbtAvg === null || cbtAvg >= 70)) status = { label: 'Ready', color: 'green' }
      else if (creditScore < 580 || (cbtAvg !== null && cbtAvg < 50)) status = { label: 'Critical', color: 'red' }
      else status = { label: 'At Risk', color: 'yellow' }
    }

    const attPct = u.attendance?.total > 0 ? Math.round((u.attendance.attended / u.attendance.total) * 100) : 0
    const delta = u.creditHistory?.length >= 2 ? u.creditHistory[u.creditHistory.length - 1].score - u.creditHistory[0].score : null
      
    return { ...u, latest, accountStatus: status, attPct, delta, cbtAvg }
  }), [users])

  const filtered = useMemo(() => enriched.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.accountStatus.color === filter
    return matchSearch && matchFilter
  }), [enriched, search, filter])

  const counts = {
    all: enriched.length,
    green: enriched.filter(u => u.status.color === 'green').length,
    yellow: enriched.filter(u => u.status.color === 'yellow').length,
    red: enriched.filter(u => u.status.color === 'red').length,
  }

  const distData = [
    { name: 'Ready', count: counts.green, color: PGREEN },
    { name: 'At Risk', count: counts.yellow, color: GOLD },
    { name: 'Critical', count: counts.red, color: CORAL },
  ]

  const avgScore = enriched.filter(u => u.latest).length > 0
    ? Math.round(enriched.filter(u => u.latest).reduce((sum, u) => sum + u.latest.score, 0) / enriched.filter(u => u.latest).length)
    : null

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="p-6 lg:p-10 max-w-7xl mx-auto space-y-8 print:p-0">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-bold tracking-tight mb-2" style={{color: NAVY}}>Watchtower</h1>
          <p className="font-medium opacity-60" style={{color: NAVY}}>Portfolio monitoring and cohort analytics.</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold shadow-sm hover:border-teal-500 hover:text-teal-600 transition-all print:hidden">
          <Activity size={18} className="text-teal-600" /> Download Cohort Report
        </button>
      </div>

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
              <TrendingUp size={16} style={{color: PGREEN} } />
            </div>
          </div>
        </div>
        <div className="card p-6 lg:col-span-2">
           <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Status Distribution</h3>
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

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm" placeholder="Search name or email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex p-1 bg-gray-100 rounded-xl w-full md:w-auto gap-1">
          {['all', 'green', 'yellow', 'red'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white shadow-sm text-navy-900' : 'text-gray-400'}`}>
              {f === 'all' ? 'All' : f === 'green' ? 'Ready' : f === 'yellow' ? 'At Risk' : 'Critical'}
            </button>
          ))}
        </div>
      </div>

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
            <tbody className="divide-y divide-gray-50 text-sm">
              <AnimatePresence mode='popLayout'>
                {filtered.map(u => (
                  <motion.tr key={u.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} layout className="hover:bg-gray-50/80 transition-colors group">
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
                          <span className="font-mono font-bold text-sm" style={{color: NAVY}}>{u.latest?.score || '—'}</span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Assessment</p>
                          <span className={`text-sm font-bold ${u.cbtAvg >= 70 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {u.cbtAvg !== null ? `${Math.round(u.cbtAvg)}%` : '—'}
                          </span>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Attendance</p>
                          <span className="text-sm font-bold" style={{color: NAVY}}>{u.attPct}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/participant/${u.id}`} className="p-2 text-gray-400 hover:text-navy-900 bg-gray-100 rounded-lg">
                          <Activity size={14} />
                        </Link>
                        <button onClick={() => toggleSuspend(u.id, u.status, u.name)} className={`p-2 rounded-lg transition-colors ${u.status === 'suspended' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'}`} title={u.status === 'suspended' ? 'Activate' : 'Suspend'}>
                          {u.status === 'suspended' ? <UserCheck size={14}/> : <ShieldAlert size={14}/>}
                        </button>
                        <button onClick={() => deleteUser(u.id, u.name)} className="p-2 text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors" title="Delete Permanent">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}