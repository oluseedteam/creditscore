import { Link } from 'react-router-dom'
import { Lock, Unlock, Phone, Mail, MessageSquare, CheckCircle, ArrowRight, TrendingUp } from 'lucide-react'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'

const loanOfficers = [
  { name: 'Patricia Owens', title: 'Senior Loan Officer', specialty: 'FHA & First-time buyers', initials: 'PO', available: true },
  { name: 'Marcus Webb',    title: 'Mortgage Consultant',  specialty: 'Conventional & Jumbo',    initials: 'MW', available: true },
  { name: 'Diana Foster',  title: 'USDA Loan Specialist', specialty: 'Rural & USDA programs',   initials: 'DF', available: false },
]

const loanTypes = [
  { name: 'FHA Loan',         minScore: 580, downPct: '3.5%', best: 'First-time buyers' },
  { name: 'Conventional',     minScore: 620, downPct: '3–20%', best: 'Strong credit' },
  { name: 'USDA Loan',        minScore: 640, downPct: '0%',    best: 'Rural properties' },
  { name: 'VA Loan',          minScore: 580, downPct: '0%',    best: 'Veterans / military' },
]

export default function LoanGatewayPage() {
  const { user } = useAuth()
  const history = user?.creditHistory || []
  const latest = history[history.length - 1]
  const status = latest ? getStatusFromScore(latest.score) : null
  const isUnlocked = status?.color === 'green'
  const pct = latest ? Math.round(((latest.score - 300) / 550) * 100) : 0
  const pointsNeeded = latest ? Math.max(0, 670 - latest.score) : 670

  return (
    <div className="p-6 lg:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-navy-900 mb-1">Loan Gateway</h1>
        <p className="text-navy-800/60">Your path from credit-ready to loan-approved.</p>
      </div>

      {/* Gateway status card */}
      <div className={`card p-8 mb-8 relative overflow-hidden ${isUnlocked ? 'border-forest-300' : 'border-cream-200'}`}>
        <div className={`absolute inset-0 opacity-30 pointer-events-none rounded-2xl ${isUnlocked ? 'bg-gradient-to-br from-forest-50 to-transparent' : ''}`} />
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shrink-0 mx-auto lg:mx-0 ${isUnlocked ? 'bg-forest-100' : 'bg-cream-200'}`}>
            {isUnlocked
              ? <Unlock size={40} className="text-forest-600" />
              : <Lock size={40} className="text-navy-800/30" />
            }
          </div>
          <div className="flex-1">
            {isUnlocked ? (
              <>
                <div className="badge-green mb-3 inline-flex"><CheckCircle size={13} /> Unlocked</div>
                <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">You're loan-ready!</h2>
                <p className="text-navy-800/60 text-sm">Your credit score of <strong>{latest?.score}</strong> qualifies you for loan assistance. Connect with a loan officer below to start your mortgage journey.</p>
              </>
            ) : (
              <>
                <div className="badge-red mb-3 inline-flex"><Lock size={13} /> Locked</div>
                <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
                  {pointsNeeded} more points to unlock
                </h2>
                <p className="text-navy-800/60 text-sm">Reach a Good credit score (670+) to unlock the Loan Assistance module. Keep submitting monthly scores and following your coaching card.</p>
                {latest && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-navy-800/50 mb-1.5">
                      <span>Current: {latest.score}</span>
                      <span>Goal: 670</span>
                    </div>
                    <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${Math.min(pct * 1.5, 98)}%` }} />
                    </div>
                  </div>
                )}
                <Link to="/credit-score" className="btn-secondary inline-flex mt-4 text-sm">
                  <TrendingUp size={15} /> Update my score <ArrowRight size={15} />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {isUnlocked && (
        <>
          {/* Loan officers */}
          <h2 className="font-display text-xl font-semibold text-navy-900 mb-4">Connect with a loan officer</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {loanOfficers.map((officer, i) => (
              <div key={i} className={`card p-5 ${!officer.available ? 'opacity-60' : 'card-hover'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-forest-200 flex items-center justify-center text-forest-800 text-sm font-medium">{officer.initials}</div>
                  <div>
                    <p className="font-medium text-navy-900 text-sm">{officer.name}</p>
                    <p className="text-xs text-navy-800/50">{officer.title}</p>
                  </div>
                </div>
                <p className="text-xs text-navy-800/50 mb-4 bg-cream-100 rounded-lg px-3 py-2">{officer.specialty}</p>
                <div className="space-y-2">
                  <button disabled={!officer.available} className={`flex items-center gap-2 w-full text-xs px-3 py-2 rounded-lg transition-colors ${officer.available ? 'bg-forest-600 text-white hover:bg-forest-700' : 'bg-cream-200 text-navy-800/30 cursor-not-allowed'}`}>
                    <Phone size={12} /> {officer.available ? 'Request a call' : 'Unavailable'}
                  </button>
                  <button disabled={!officer.available} className={`flex items-center gap-2 w-full text-xs px-3 py-2 rounded-lg border transition-colors ${officer.available ? 'border-forest-200 text-forest-700 hover:bg-forest-50' : 'border-cream-200 text-navy-800/30 cursor-not-allowed'}`}>
                    <Mail size={12} /> Send a message
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Loan types */}
          <h2 className="font-display text-xl font-semibold text-navy-900 mb-4">Loan programs you qualify for</h2>
          <div className="card overflow-hidden mb-8">
            <div className="grid grid-cols-4 p-4 border-b border-cream-200 text-xs text-navy-800/50 uppercase tracking-wider">
              <span>Program</span><span>Min. score</span><span>Down pmt</span><span>Best for</span>
            </div>
            {loanTypes.map((loan, i) => (
              <div key={i} className="grid grid-cols-4 p-4 items-center border-b border-cream-100 last:border-0 hover:bg-cream-50 transition-colors">
                <span className="font-medium text-navy-900 text-sm">{loan.name}</span>
                <span className="text-sm text-navy-800/70 font-mono">{loan.minScore}</span>
                <span className="text-sm text-navy-800/70">{loan.downPct}</span>
                <span className="text-xs text-navy-800/50">{loan.best}</span>
              </div>
            ))}
          </div>

          {/* General enquiries */}
          <div className="card p-6 border-forest-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-forest-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-navy-900 mb-1">General enquiries</h3>
                <p className="text-sm text-navy-800/60 mb-4">Not ready to speak with a loan officer yet? Send us a general question about the mortgage process.</p>
                <textarea className="input-field text-sm resize-none" rows={3} placeholder="Type your question here..." />
                <button className="btn-primary mt-3 text-sm">Send enquiry <ArrowRight size={15} /></button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Loan info regardless of lock status */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold text-navy-900 mb-4">Understanding loan programs</h2>
        <div className="card overflow-hidden">
          <div className="grid grid-cols-4 p-4 border-b border-cream-200 text-xs text-navy-800/50 uppercase tracking-wider">
            <span>Program</span><span>Min. score</span><span>Down pmt</span><span>Best for</span>
          </div>
          {loanTypes.map((loan, i) => (
            <div key={i} className={`grid grid-cols-4 p-4 items-center border-b border-cream-100 last:border-0 transition-colors ${!isUnlocked && latest && latest.score >= loan.minScore ? 'bg-forest-50/50' : 'hover:bg-cream-50'}`}>
              <div className="flex items-center gap-2">
                <span className="font-medium text-navy-900 text-sm">{loan.name}</span>
                {!isUnlocked && latest && latest.score >= loan.minScore && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-forest-100 text-forest-700">eligible</span>
                )}
              </div>
              <span className="text-sm text-navy-800/70 font-mono">{loan.minScore}</span>
              <span className="text-sm text-navy-800/70">{loan.downPct}</span>
              <span className="text-xs text-navy-800/50">{loan.best}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
