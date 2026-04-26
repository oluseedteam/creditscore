import { useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Cell, AreaChart, Area } from 'recharts'
import { CheckCircle, AlertTriangle, XCircle, TrendingUp, Zap } from 'lucide-react'
import { useAuth, getStatusFromScore } from '../../context/AuthContext'
import { format } from 'date-fns'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71', GOLD='#F4B000', CORAL='#F56A6A'

function StatusBadge({ score }) {
  const {label,color} = getStatusFromScore(score)
  const cfg = color==='green'?{bg:'#e8faf0',c:PGREEN,Icon:CheckCircle}:color==='yellow'?{bg:'#fef9e6',c:GOLD,Icon:AlertTriangle}:{bg:'#fef0f0',c:CORAL,Icon:XCircle}
  return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{background:cfg.bg,color:cfg.c}}><cfg.Icon size={12}/>{label}</span>
}

const coaching = {
  red:[
    {title:'Dispute inaccuracies',         body:'Pull your full credit report and file disputes for any errors. Inaccurate collections are the fastest wins.'},
    {title:'Catch up on missed payments',  body:'Payment history is 35% of your score. Even one on-time payment this month creates upward momentum.'},
    {title:'Avoid new credit applications',body:'Every hard inquiry drops your score 5–10 pts. Pause all new applications for 60 days.'},
  ],
  yellow:[
    {title:'Lower your utilization', body:'Aim to use less than 30% of each credit card limit. Below 10% is ideal for maximum score gains.'},
    {title:'Become an authorized user',body:'Ask a family member with great credit to add you as an authorized user. Their history boosts yours.'},
    {title:'Set up auto-pay',         body:'Never miss another payment. A single 30-day late mark can drop your score 80–110 pts.'},
  ],
  green:[
    {title:'Maintain low utilization', body:"You're in great shape — keep utilization below 10% and monitor for any new derogatory marks."},
    {title:'Review mortgage options',  body:'With Good credit, you qualify for competitive rates. Explore FHA, conventional, and USDA loan products.'},
    {title:'Connect with a loan officer',body:'Your Loan Gateway is unlocked. A 30-minute call can confirm your maximum purchase price and next steps.'},
  ],
}

const CustomTip = ({active,payload,label})=>{
  if(!active||!payload?.length) return null
  const s=payload[0].value
  const c=s>=670?PGREEN:s>=580?GOLD:CORAL
  return <div className="card px-3 py-2 text-xs shadow-lg"><p style={{color:'#6B7280'}}>{label}</p><p className="font-bold text-sm" style={{color:c}}>{s}</p></div>
}

export default function CreditScorePage() {
  const {user,addCreditEntry} = useAuth()
  const [score,setScore]   = useState('')
  const [note,setNote]     = useState('')
  const [success,setSuccess] = useState(false)
  const [error,setError]   = useState('')

  const history = user?.creditHistory || []
  const latest  = history[history.length-1]
  const status  = latest ? getStatusFromScore(latest.score) : null
  const tips    = status ? coaching[status.color] : []
  const pct     = latest ? Math.round(((latest.score-300)/550)*100) : 0
  const barColor= status?.color==='green'?PGREEN:status?.color==='yellow'?GOLD:CORAL
  const currentMonth = new Date().toISOString().slice(0,7)
  const alreadySubmitted = history.some(h=>h.month===currentMonth)

  const chartData = history.map(h=>({
    month: format(new Date(h.month+'-01'),'MMM yy'),
    score: h.score,
  }))

  // Score change per month (bar chart)
  const deltaData = history.slice(1).map((h,i)=>({
    month: format(new Date(h.month+'-01'),'MMM yy'),
    change: h.score - history[i].score,
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const num = parseInt(score)
    if (!num||num<300||num>850) { setError('Enter a score between 300 and 850.'); return }
    setError('')
    addCreditEntry(num, note)
    setScore(''); setNote('')
    setSuccess(true); setTimeout(()=>setSuccess(false),3000)
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1" style={{color:NAVY}}>Credit Score</h1>
        <p style={{color:'#6B7280'}}>Track your monthly progress and unlock AI coaching guidance.</p>
      </div>

      {/* Entry + current standing */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="font-display font-semibold mb-0.5" style={{color:NAVY}}>{alreadySubmitted?'Update this month':'Add monthly score'}</h2>
            <p className="text-xs mb-5" style={{color:'#6B7280'}}>{format(new Date(),'MMMM yyyy')} · {alreadySubmitted?'Already submitted — update it':'Not yet submitted'}</p>
            {success&&<div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-4" style={{background:'#e8faf0',border:'1px solid #88e6b2',color:PGREEN}}><CheckCircle size={15}/>Score saved!</div>}
            {error&&<div className="p-3 rounded-xl text-sm mb-4" style={{background:'#fef0f0',border:'1px solid #faaeae',color:CORAL}}>{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Credit score (300–850)</label>
                <input type="number" min="300" max="850" className="input-field font-mono text-2xl" placeholder="e.g. 640"
                  value={score} onChange={e=>setScore(e.target.value)} required/>
              </div>
              <div>
                <label className="label">Note (optional)</label>
                <input type="text" className="input-field text-sm" placeholder="What changed this month?"
                  value={note} onChange={e=>setNote(e.target.value)}/>
              </div>
              <button type="submit" className="btn-primary w-full justify-center"><TrendingUp size={16}/>Save score</button>
            </form>
            <div className="mt-5 space-y-2">
              {[[CORAL,'Bad','300–579'],[GOLD,'Low','580–669'],[PGREEN,'Good','670–850']].map(([c,l,r])=>(
                <div key={l} className="flex items-center gap-2 text-xs" style={{color:'#6B7280'}}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{background:c}}/>{l} ({r})
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {latest ? (
            <div className="card p-6 h-full">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <h2 className="font-display font-semibold" style={{color:NAVY}}>Current standing</h2>
                <StatusBadge score={latest.score}/>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-display text-6xl font-bold" style={{color:NAVY}}>{latest.score}</span>
                <span className="text-sm" style={{color:'#6B7280'}}>/850</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden mb-1.5" style={{background:'#E3E6EC'}}>
                <div className="h-full rounded-full transition-all duration-1000" style={{width:`${pct}%`,background:`linear-gradient(90deg,${barColor}cc,${barColor})`}}/>
              </div>
              <div className="flex justify-between text-[11px] mb-4" style={{color:'#6B7280'}}>
                <span>300</span><span>580</span><span>670</span><span>850</span>
              </div>
              {status?.color!=='green'&&(
                <div className="p-3 rounded-xl" style={{background:'#F9F5EF'}}>
                  <p className="text-xs" style={{color:'#6B7280'}}>
                    <span className="font-medium" style={{color:NAVY}}>{670-latest.score} points</span> to reach Good credit
                  </p>
                  <div className="h-1.5 rounded-full mt-2 overflow-hidden" style={{background:'#E3E6EC'}}>
                    <div className="h-full rounded-full" style={{width:`${Math.min((latest.score-300)/(670-300)*100,100)}%`,background:TEAL}}/>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-6 h-full flex items-center justify-center text-center">
              <div><TrendingUp className="mx-auto mb-3" size={40} style={{color:'#E3E6EC'}}/><p className="text-sm" style={{color:'#6B7280'}}>Submit your first score to see your standing</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Charts row */}
      {chartData.length >= 2 && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Area chart */}
          <div className="chart-card">
            <p className="chart-title">Score over time</p>
            <p className="chart-sub">Monthly credit score — dashed line = 670 Good threshold</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{top:5,right:10,bottom:0,left:-20}}>
                <defs>
                  <linearGradient id="csGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={barColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={barColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                <YAxis domain={[300,850]} tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTip/>}/>
                <ReferenceLine y={670} stroke={PGREEN} strokeDasharray="4 4" strokeOpacity={0.5}/>
                <ReferenceLine y={580} stroke={GOLD}   strokeDasharray="4 4" strokeOpacity={0.4}/>
                <Area type="monotone" dataKey="score" stroke={barColor} strokeWidth={2.5} fill="url(#csGrad)"
                  dot={{r:5,fill:barColor,strokeWidth:0}} activeDot={{r:7}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly change bar chart */}
          {deltaData.length >= 1 && (
            <div className="chart-card">
              <p className="chart-title">Monthly point changes</p>
              <p className="chart-sub">How many points you gained or lost each month</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={deltaData} margin={{top:5,right:10,bottom:0,left:-20}}>
                  <XAxis dataKey="month" tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                  <Tooltip formatter={(v)=>[`${v>0?'+':''}${v} pts`,'Change']} cursor={{fill:'rgba(0,0,0,0.03)'}}/>
                  <ReferenceLine y={0} stroke="#E3E6EC"/>
                  <Bar dataKey="change" radius={[4,4,0,0]}>
                    {deltaData.map((d,i)=><Cell key={i} fill={d.change>=0?PGREEN:CORAL}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* History table */}
      {history.length > 0 && (
        <div className="card mb-8 overflow-hidden">
          <div className="p-5 border-b" style={{borderColor:'#E3E6EC'}}>
            <h2 className="font-display font-semibold" style={{color:NAVY}}>Full score history</h2>
          </div>
          <div className="divide-y" style={{borderColor:'#F9F5EF'}}>
            {[...history].reverse().map((entry,i)=>(
              <div key={i} className="flex items-center justify-between p-4 transition-colors hover:opacity-90" style={{background:i%2===0?'white':'#FAFAF8'}}>
                <div>
                  <p className="text-sm font-medium" style={{color:NAVY}}>{format(new Date(entry.month+'-01'),'MMMM yyyy')}</p>
                  {entry.note&&<p className="text-xs" style={{color:'#6B7280'}}>{entry.note}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge score={entry.score}/>
                  <span className="font-mono font-medium" style={{color:NAVY}}>{entry.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Coaching Card */}
      {tips.length > 0 && (
        <div className="card p-6" style={{borderColor:`${barColor}30`}}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:`${barColor}15`}}>
              <Zap size={18} style={{color:barColor}}/>
            </div>
            <div>
              <h2 className="font-display font-semibold" style={{color:NAVY}}>Your AI coaching card</h2>
              <p className="text-xs" style={{color:'#6B7280'}}>Personalized steps for this month</p>
            </div>
          </div>
          <div className="space-y-4">
            {tips.map((tip,i)=>(
              <div key={i} className="flex gap-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-medium" style={{background:`${barColor}15`,color:barColor}}>{i+1}</div>
                <div>
                  <p className="font-medium text-sm mb-0.5" style={{color:NAVY}}>{tip.title}</p>
                  <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{tip.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}