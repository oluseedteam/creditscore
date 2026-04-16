import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp } from 'lucide-react'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'
import { format } from 'date-fns'

function StatusBadge({ score }) {
  const { label, color } = getStatusFromScore(score)
  const cls = color === 'green' ? 'badge-green' : color === 'yellow' ? 'badge-yellow' : 'badge-red'
  const Icon = color === 'green' ? CheckCircle : color === 'yellow' ? AlertTriangle : XCircle
  return <span className={cls}><Icon size={12} />{label}</span>
}

const coachingTips = {
  red: [
    { title: 'Dispute inaccuracies', body: 'Pull your full credit report and file disputes for any errors. Inaccurate collections are the fastest wins.' },
    { title: 'Catch up on missed payments', body: 'Payment history is 35% of your score. Even one on-time payment this month creates upward momentum.' },
    { title: 'Avoid new credit applications', body: 'Every hard inquiry drops your score 5–10 pts. Pause all new applications for 60 days.' },
  ],
  yellow: [
    { title: 'Lower your utilization', body: 'Aim to use less than 30% of each credit card limit. Below 10% is ideal for maximum score gains.' },
    { title: 'Become an authorized user', body: 'Ask a family member with great credit to add you as an authorized user. Their history boosts yours.' },
    { title: 'Set up auto-pay', body: 'Never miss another payment. Even a single 30-day late mark can drop your score by 80–110 pts.' },
  ],
  green: [
    { title: 'Maintain low utilization', body: 'You\'re in great shape — keep utilization below 10% and monitor for any new derogatory marks.' },
    { title: 'Review mortgage options', body: 'With Good credit, you qualify for competitive rates. Explore FHA, conventional, and USDA loan products.' },
    { title: 'Connect with a loan officer', body: 'Your Loan Gateway is unlocked. A 30-minute call can confirm your maximum purchase price and next steps.' },
  ],
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-4 py-3 text-sm shadow-lg">
      <p className="text-navy-800/50 text-xs mb-1">{label}</p>
      <p className="font-display font-semibold text-navy-900 text-lg">{payload[0].value}</p>
      <StatusBadge score={payload[0].value} />
    </div>
  )
}

export default function CreditScorePage() {
  const { user, addCreditEntry } = useAuth()
  const [score, setScore] = useState('')
  const [note, setNote] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const history = user?.creditHistory || []
  const latest = history[history.length - 1]
  const status = latest ? getStatusFromScore(latest.score) : null
  const tips = status ? coachingTips[status.color] : []

  const currentMonth = new Date().toISOString().slice(0, 7)
  const alreadySubmitted = history.some(h => h.month === currentMonth)

  const chartData = history.map(h => ({
    month: format(new Date(h.month + '-01'), 'MMM yy'),
    score: h.score,
    note: h.note,
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseInt(score)
    if (!num || num < 300 || num > 850) { setError('Enter a score between 300 and 850.'); return }
    setError('')
    addCreditEntry(num, note)
    setScore('')
    setNote('')
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const pct = latest ? Math.round(((latest.score - 300) / 550) * 100) : 0
  const barColor = status?.color === 'green' ? '#1a9464' : status?.color === 'yellow' ? '#d97706' : '#dc2626'

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-1">Credit Score</h1>
        <p className="text-navy-800/60">Track your monthly progress and unlock coaching guidance.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        {/* Entry form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-display font-semibold text-navy-900 mb-1">
              {alreadySubmitted ? 'Update this month' : 'Add monthly score'}
            </h2>
            <p className="text-xs text-navy-800/50 mb-5">
              {format(new Date(), 'MMMM yyyy')} · {alreadySubmitted ? 'Already submitted — you can update it' : 'Not yet submitted'}
            </p>

            {success && (
              <div className="flex items-center gap-2 p-3 bg-forest-50 border border-forest-200 rounded-xl text-forest-700 text-sm mb-4">
                <CheckCircle size={16} /> Score saved successfully!
              </div>
            )}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Credit score (300–850)</label>
                <input type="number" min="300" max="850" className="input-field font-mono text-2xl" placeholder="e.g. 640"
                  value={score} onChange={e => setScore(e.target.value)} required />
              </div>
              <div>
                <label className="label">Note (optional)</label>
                <input type="text" className="input-field text-sm" placeholder="What changed this month?"
                  value={note} onChange={e => setNote(e.target.value)} />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                <TrendingUp size={16} /> Save score
              </button>
            </form>

            {/* Score ranges */}
            <div className="mt-5 space-y-2">
              {[
                { label: 'Bad (300–579)', color: 'bg-red-500', w: '22%' },
                { label: 'Low (580–669)', color: 'bg-amber-400', w: '17%' },
                { label: 'Good (670–850)', color: 'bg-forest-500', w: '60%' },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-2 text-xs text-navy-800/50">
                  <div className={`w-2 h-2 rounded-full ${r.color}`} />
                  {r.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current status */}
        <div className="lg:col-span-3">
          {latest ? (
            <div className="card p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-navy-900">Current standing</h2>
                <StatusBadge score={latest.score} />
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display text-6xl font-bold text-navy-900">{latest.score}</span>
                <span className="text-navy-800/40 text-sm">/ 850</span>
              </div>
              <div className="mb-2">
                <div className="h-4 bg-cream-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
                </div>
                <div className="flex justify-between mt-1.5 text-[11px] text-navy-800/40">
                  <span>300</span><span>580</span><span>670</span><span>850</span>
                </div>
              </div>
              {status?.color !== 'green' && (
                <div className="mt-4 p-3 bg-cream-100 rounded-xl">
                  <p className="text-xs text-navy-800/60">
                    <span className="font-medium text-navy-900">{670 - latest.score} points</span> to reach Good credit status
                  </p>
                  <div className="h-1.5 bg-cream-200 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-forest-400 rounded-full" style={{ width: `${Math.min(pct * 1.4, 100)}%` }} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-6 h-full flex items-center justify-center text-center">
              <div>
                <TrendingUp className="mx-auto text-cream-300 mb-3" size={40} />
                <p className="text-navy-800/50 text-sm">Submit your first score to see your standing</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      {chartData.length >= 2 && (
        <div className="card p-6 mb-8">
          <h2 className="font-display font-semibold text-navy-900 mb-6">Score history</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis domain={[300, 850]} tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={670} stroke="#1a9464" strokeDasharray="4 4" strokeOpacity={0.4} />
              <ReferenceLine y={580} stroke="#d97706" strokeDasharray="4 4" strokeOpacity={0.4} />
              <Line type="monotone" dataKey="score" stroke="#1a9464" strokeWidth={2.5} dot={{ r: 5, fill: '#1a9464', strokeWidth: 0 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* History table */}
      {history.length > 0 && (
        <div className="card mb-8 overflow-hidden">
          <div className="p-5 border-b border-cream-200">
            <h2 className="font-display font-semibold text-navy-900">Score history</h2>
          </div>
          <div className="divide-y divide-cream-100">
            {[...history].reverse().map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-cream-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-navy-900">{format(new Date(entry.month + '-01'), 'MMMM yyyy')}</p>
                  {entry.note && <p className="text-xs text-navy-800/50">{entry.note}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge score={entry.score} />
                  <span className="font-mono font-medium text-navy-900">{entry.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Coaching Card */}
      {tips.length > 0 && (
        <div className="card p-6 border-forest-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl bg-forest-100 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0e5c3d" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div>
              <h2 className="font-display font-semibold text-navy-900">Your AI coaching card</h2>
              <p className="text-xs text-navy-800/50">Personalized steps for this month</p>
            </div>
          </div>
          <div className="space-y-4">
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-forest-100 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-forest-700">{i + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-navy-900 text-sm mb-0.5">{tip.title}</p>
                  <p className="text-sm text-navy-800/60 leading-relaxed">{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
