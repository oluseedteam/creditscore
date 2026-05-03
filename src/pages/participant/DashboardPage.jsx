import { Link } from 'react-router-dom'
import { TrendingUp, BookOpen, Key, ArrowRight, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'
import { format } from 'date-fns'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71', GOLD='#F4B000', CORAL='#F56A6A'

function StatusIcon({ color }) {
  if (color==='green')  return <CheckCircle size={16} style={{color:PGREEN}}/>
  if (color==='yellow') return <AlertTriangle size={16} style={{color:GOLD}}/>
  return <XCircle size={16} style={{color:CORAL}}/>
}

export default function DashboardPage() {
  const { user, api } = useAuth()
  const [curriculum, setCurriculum] = useState([])
  const [cbtResults, setCbtResults] = useState([])

  useEffect(() => {
    const fetchCV = async () => {
      try {
        const res = await api.get('/curriculum-frameworks')
        setCurriculum(res.data)
      } catch { /* ignore */ }
    }
    const fetchResults = async () => {
      try {
        const res = await api.get('/cbt-results/me')
        setCbtResults(res.data)
      } catch { /* ignore */ }
    }
    fetchCV()
    fetchResults()
  }, [api])

  const history = user?.creditHistory || []
  const latest  = history[history.length-1]
  const prev    = history[history.length-2]
  const status  = latest ? getStatusFromScore(latest.score) : null
  const delta   = latest&&prev ? latest.score-prev.score : null
  const pct     = latest ? Math.round(((latest.score-300)/550)*100) : 0
  
  const totalClasses = curriculum.length || 8
  const attendedScore = user?.attendance?.attended || 0
  const attPct = Math.round((attendedScore/totalClasses)*100) || 0
  const attText = `${attendedScore}/${totalClasses} classes`

  const barColor= status?.color==='green'?PGREEN:status?.color==='yellow'?GOLD:CORAL

  const chartData = history.map(h=>({
    month: format(new Date(h.month+'-01'),'MMM yy'),
    score: h.score,
  }))

  const radialData = [{ value: pct, fill: barColor }]

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="p-6 lg:p-10 max-w-5xl print:p-0">
      {/* Greeting */}
      <div className="mb-8 flex justify-between items-start flex-wrap gap-4 print:mb-0">
        <div>
          <h1 className="font-display text-4xl font-black mb-2 tracking-tight" style={{color:NAVY}}>
            Howdy, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="font-medium opacity-60" style={{color:NAVY}}>Here's your real-time homeownership progress and cohort analysis.</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold shadow-sm hover:border-teal-500 hover:text-teal-600 transition-all print:hidden">
          <Activity size={18} className="text-teal-600" /> Export Full Analysis
        </button>
      </div>

      {/* Top row: Score hero + Radial */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Score card */}
        <div className="card p-6 lg:col-span-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" style={{background:`${barColor}0A`}}/>
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider mb-1" style={{color:'#6B7280'}}>Latest credit score</p>
                {latest ? (
                  <div className="flex items-baseline gap-3">
                    <span className="font-display text-6xl font-bold" style={{color:NAVY}}>{latest.score}</span>
                    {delta!==null&&<span className="text-sm font-medium" style={{color:delta>=0?PGREEN:CORAL}}>{delta>=0?'+':''}{delta} pts</span>}
                  </div>
                ) : <span className="font-display text-4xl font-bold" style={{color:'#E3E6EC'}}>—</span>}
              </div>
              {status&&(
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{background:`${barColor}15`,color:barColor}}>
                  <StatusIcon color={status.color}/>{status.label}
                </div>
              )}
            </div>
            {latest ? (
              <>
                <div className="h-3 rounded-full overflow-hidden mb-1.5" style={{background:'#E3E6EC'}}>
                  <div className="h-full rounded-full transition-all duration-1000" style={{width:`${pct}%`,background:barColor}}/>
                </div>
                <div className="flex justify-between text-[10px]" style={{color:'#6B7280'}}>
                  <span>300 Bad</span><span>580 Low</span><span>670 Good</span><span>850</span>
                </div>
                <p className="text-sm mt-3" style={{color:'#6B7280'}}>{status?.description}</p>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm mb-3" style={{color:'#6B7280'}}>No score submitted yet. Add your first entry to start tracking.</p>
                <Link to="/credit-score" className="btn-primary text-sm py-2">Add first score <ArrowRight size={15}/></Link>
              </div>
            )}
          </div>
        </div>

        {/* Radial progress */}
        <div className="card p-6 flex flex-col items-center justify-center text-center">
          <p className="chart-title w-full text-center mb-1">Score progress</p>
          <p className="chart-sub w-full text-center">Toward 850</p>
          <ResponsiveContainer width="100%" height={140}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={8} fill={barColor} background={{fill:'#E3E6EC'}}/>
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="font-display text-3xl font-bold mt-1" style={{color:NAVY}}>{latest?.score||'—'}</p>
          <p className="text-xs mt-0.5" style={{color:'#6B7280'}}>{pct}% of max</p>
        </div>
      </div>

      {/* Score history chart */}
      {chartData.length >= 2 && (
        <div className="chart-card mb-6">
          <p className="chart-title">Score history</p>
          <p className="chart-sub">Your credit score journey over time</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{top:5,right:10,bottom:0,left:-20}}>
              <defs>
                <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={barColor} stopOpacity={0.25}/>
                  <stop offset="95%" stopColor={barColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
              <YAxis domain={[300,850]} tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
              <Tooltip content={({active,payload,label}) => {
                if(!active||!payload?.length) return null
                return <div className="card px-3 py-2 text-xs shadow-lg"><p style={{color:'#6B7280'}}>{label}</p><p className="font-bold" style={{color:barColor}}>{payload[0].value}</p></div>
              }}/>
              <Area type="monotone" dataKey="score" stroke={barColor} strokeWidth={2.5} fill="url(#dashGrad)"
                dot={{r:4,fill:barColor,strokeWidth:0}} activeDot={{r:6}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* CBT Performance Section */}
      <div className="mb-8">
        <h2 className="font-display text-lg font-semibold mb-4" style={{color:NAVY}}>CBT Performance</h2>
        <div className="card overflow-hidden">
          <div className="divide-y" style={{borderColor:'#F1F5F9'}}>
            {cbtResults.length > 0 ? (
              cbtResults.map((res, i) => {
                const pct = Math.round((res.score / res.total_questions) * 100)
                return (
                  <div key={i} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:`${TEAL}10`}}>
                        <Activity size={18} style={{color:TEAL}} />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{color:NAVY}}>{res.test?.subject}</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{format(new Date(res.created_at), 'PPP')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-0.5">Score</p>
                        <p className="text-xl font-black" style={{color: pct >= 50 ? PGREEN : CORAL}}>{pct}%</p>
                      </div>
                      <Link to="/cbt" className="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-navy-900 hover:text-white transition-all print:hidden">
                         <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">No test results synchronized</p>
                <p className="text-[10px] text-gray-400">Complete a CBT test to see your performance here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Score entries',  value:history.length,  sub:'months tracked' },
          { label:'Attendance',     value:`${attPct}%`,    sub:attText },
          { label:'Total gain',     value:history.length>=2?`${latest.score-history[0].score>0?'+':''}${latest.score-history[0].score}`:'—', sub:'since start' },
          { label:'Loan status',    value:status?.color==='green'?'🔓':'🔒', sub:status?.color==='green'?'Unlocked':'Keep improving' },
        ].map((s,i)=>(
          <div key={i} className="card p-4">
            <p className="text-xs mb-1" style={{color:'#6B7280'}}>{s.label}</p>
            <p className="font-display text-2xl font-bold" style={{color:NAVY}}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{color:'#6B7280'}}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="font-display text-lg font-semibold mb-4" style={{color:NAVY}}>Quick actions</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {to:'/credit-score',   icon:TrendingUp, label:'Update credit score',  desc:'Add your monthly score', accent:PGREEN},
          {to:'/class-progress', icon:BookOpen,   label:'Class progress',       desc:`${attPct}% attendance`,  accent:TEAL},
          {to:'/loan-gateway',   icon:Key,        label:'Loan gateway',         desc:status?.color==='green'?'Unlocked!':'Reach 670+ to unlock', accent:status?.color==='green'?PGREEN:GOLD},
        ].map((item)=>(
          <Link key={item.to} to={item.to} className="card-hover p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-opacity" style={{background:`${item.accent}18`}}>
              <item.icon size={18} style={{color:item.accent}}/>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm" style={{color:NAVY}}>{item.label}</p>
              <p className="text-xs" style={{color:'#6B7280'}}>{item.desc}</p>
            </div>
            <ArrowRight size={15} className="ml-auto shrink-0 transition-all group-hover:translate-x-0.5" style={{color:'#E3E6EC'}}/>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}