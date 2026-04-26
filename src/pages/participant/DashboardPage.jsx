import { Link } from 'react-router-dom'
import { TrendingUp, BookOpen, Key, ArrowRight, CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar } from 'recharts'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'
import { format } from 'date-fns'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71', GOLD='#F4B000', CORAL='#F56A6A'

function StatusIcon({ color }) {
  if (color==='green')  return <CheckCircle size={16} style={{color:PGREEN}}/>
  if (color==='yellow') return <AlertTriangle size={16} style={{color:GOLD}}/>
  return <XCircle size={16} style={{color:CORAL}}/>
}

export default function DashboardPage() {
  const { user } = useAuth()
  const history = user?.creditHistory || []
  const latest  = history[history.length-1]
  const prev    = history[history.length-2]
  const status  = latest ? getStatusFromScore(latest.score) : null
  const delta   = latest&&prev ? latest.score-prev.score : null
  const pct     = latest ? Math.round(((latest.score-300)/550)*100) : 0
  const attPct  = user?.attendance?.total>0 ? Math.round((user.attendance.attended/user.attendance.total)*100) : 0
  const barColor= status?.color==='green'?PGREEN:status?.color==='yellow'?GOLD:CORAL

  const chartData = history.map(h=>({
    month: format(new Date(h.month+'-01'),'MMM yy'),
    score: h.score,
  }))

  const radialData = [{ value: pct, fill: barColor }]

  const CustomTip = ({active,payload,label})=>{
    if(!active||!payload?.length) return null
    return <div className="card px-3 py-2 text-xs shadow-lg"><p style={{color:'#6B7280'}}>{label}</p><p className="font-bold" style={{color:barColor}}>{payload[0].value}</p></div>
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1" style={{color:NAVY}}>
          Good day, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{color:'#6B7280'}}>Here's your homeownership progress at a glance.</p>
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
              <Tooltip content={<CustomTip/>}/>
              <Area type="monotone" dataKey="score" stroke={barColor} strokeWidth={2.5} fill="url(#dashGrad)"
                dot={{r:4,fill:barColor,strokeWidth:0}} activeDot={{r:6}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Score entries',  value:history.length,  sub:'months tracked' },
          { label:'Attendance',     value:`${attPct}%`,    sub:`${user?.attendance?.attended}/${user?.attendance?.total} classes` },
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
        ].map(({to,icon:Icon,label,desc,accent})=>(
          <Link key={to} to={to} className="card-hover p-5 flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-opacity" style={{background:`${accent}18`}}>
              <Icon size={18} style={{color:accent}}/>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-sm" style={{color:NAVY}}>{label}</p>
              <p className="text-xs" style={{color:'#6B7280'}}>{desc}</p>
            </div>
            <ArrowRight size={15} className="ml-auto shrink-0 transition-all group-hover:translate-x-0.5" style={{color:'#E3E6EC'}}/>
          </Link>
        ))}
      </div>
    </div>
  )
}