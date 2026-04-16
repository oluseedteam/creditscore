import { useAuth } from '../../context/AuthContext'
import { CheckCircle, XCircle, BookOpen, Award } from 'lucide-react'

const curriculum = [
  { week: 1,  title: 'Introduction to Homeownership', topics: ['The homebuying timeline', 'Understanding your credit report', 'Setting goals'], completed: true },
  { week: 2,  title: 'Credit Fundamentals',           topics: ['Credit score factors', 'Reading a credit report', 'Dispute process'], completed: true },
  { week: 3,  title: 'Debt Management',               topics: ['Debt-to-income ratio', 'Payoff strategies', 'Utilization tactics'], completed: true },
  { week: 4,  title: 'Saving for a Down Payment',     topics: ['Down payment options', 'Emergency fund basics', 'Budget building'], completed: true },
  { week: 5,  title: 'Mortgage Basics',               topics: ['Loan types overview', 'Fixed vs. adjustable rates', 'Prequalification'], completed: false },
  { week: 6,  title: 'FHA & Conventional Loans',      topics: ['FHA requirements', 'PMI explained', 'Loan comparison'], completed: false },
  { week: 7,  title: 'The Home Search Process',       topics: ['Working with agents', 'Making offers', 'Inspection basics'], completed: false },
  { week: 8,  title: 'Closing & Beyond',              topics: ['Closing costs', 'Title and escrow', 'Post-closing steps'], completed: false },
]

export default function ClassProgressPage() {
  const { user } = useAuth()
  const att = user?.attendance || { attended: 0, total: 0 }
  const pct = att.total > 0 ? Math.round((att.attended / att.total) * 100) : 0
  const completedWeeks = curriculum.filter(c => c.completed).length

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-1">Class Progress</h1>
        <p className="text-navy-800/60">Your homeownership education journey.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Attendance',        value: `${pct}%`,             sub: `${att.attended} of ${att.total} classes` },
          { label: 'Modules complete',  value: `${completedWeeks}/8`, sub: 'curriculum modules' },
          { label: 'Current week',      value: `Week ${completedWeeks + 1}`, sub: curriculum[completedWeeks]?.title?.split(' ').slice(0,2).join(' ') + '...' },
          { label: 'Completion',        value: `${Math.round(completedWeeks / curriculum.length * 100)}%`, sub: 'of curriculum' },
        ].map((s, i) => (
          <div key={i} className="card p-4">
            <p className="text-xs text-navy-800/50 mb-1">{s.label}</p>
            <p className="font-display text-2xl font-bold text-navy-900">{s.value}</p>
            <p className="text-xs text-navy-800/40 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Attendance bar */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-navy-900">Attendance overview</h2>
          <span className={`text-sm font-medium ${pct >= 75 ? 'text-forest-600' : 'text-amber-600'}`}>{pct}%</span>
        </div>
        <div className="h-4 bg-cream-200 rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full bg-forest-500 transition-all duration-1000" style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-navy-800/50">
          {pct >= 75
            ? `Great attendance! You've attended ${att.attended} out of ${att.total} classes.`
            : `You need at least 75% attendance. You're ${75 - pct}% short — attend the next class!`
          }
        </p>
      </div>

      {/* Curriculum */}
      <div className="card overflow-hidden mb-8">
        <div className="p-5 border-b border-cream-200">
          <h2 className="font-display font-semibold text-navy-900">Curriculum modules</h2>
        </div>
        <div className="divide-y divide-cream-100">
          {curriculum.map((week) => (
            <div key={week.week} className={`p-5 flex gap-4 transition-colors ${week.completed ? 'hover:bg-forest-50/50' : 'hover:bg-cream-50'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${week.completed ? 'bg-forest-100' : 'bg-cream-100'}`}>
                {week.completed
                  ? <CheckCircle size={20} className="text-forest-600" />
                  : <span className="font-mono text-sm font-medium text-navy-800/40">{week.week}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className={`font-medium text-sm ${week.completed ? 'text-navy-900' : 'text-navy-800/60'}`}>
                    Week {week.week}: {week.title}
                  </p>
                  {week.completed && <span className="badge-green text-xs">Done</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {week.topics.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md bg-cream-100 text-navy-800/50">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certificate preview */}
      {completedWeeks === curriculum.length && (
        <div className="card p-8 border-forest-200 bg-forest-50 text-center">
          <Award className="mx-auto text-forest-600 mb-4" size={48} />
          <h3 className="font-display text-2xl font-bold text-forest-900 mb-2">Congratulations!</h3>
          <p className="text-forest-800/70">You've completed the full homeownership curriculum. Your certificate is ready.</p>
        </div>
      )}
    </div>
  )
}
