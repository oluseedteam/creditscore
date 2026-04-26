import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, TrendingUp, Shield, Users, Star, ChevronDown, Zap, BarChart2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Cell } from 'recharts'

// Brand colors
const TEAL   = '#066A6F'
const NAVY   = '#102A43'
const PGREEN = '#2FBF71'
const GOLD   = '#F4B000'
const CORAL  = '#F56A6A'

const stats = [
  { value: '94%',  label: 'Completion rate' },
  { value: '127',  label: 'Avg. score gain (pts)' },
  { value: '3.2',  label: 'Avg. months to Good credit' },
  { value: '500+', label: 'Homeowners created' },
]

const steps = [
  { number:'01', title:'Enroll & attend classes', desc:'Join structured homeownership curriculum. Track attendance automatically and earn progress milestones.', accent: TEAL },
  { number:'02', title:'Submit monthly scores',   desc:'Upload your credit score each month. Our AI engine analyzes your standing and triggers the right coaching path.', accent: PGREEN },
  { number:'03', title:'Get AI coaching',         desc:'Receive a personalized Coaching Card — step-by-step guidance to repair, rebuild, and elevate your credit.', accent: GOLD },
  { number:'04', title:'Unlock the loan gateway', desc:'Hit Good credit status and your Loan Assistance module unlocks automatically.', accent: CORAL },
]

const features = [
  { icon: TrendingUp, title:'Credit triage engine',   desc:'Automated color-coded routing replaces manual file reviews. Bad, Low, or Good — the system responds instantly.', color: PGREEN },
  { icon: Shield,     title:'Data privacy by design', desc:'Participants own their data with full read/write access. Admins get read-only visibility — zero risk of modifications.', color: TEAL },
  { icon: BarChart2,  title:'Rich analytics & charts', desc:'Visual dashboards with score history, attendance trends, and cohort health charts — all updated in real time.', color: GOLD },
  { icon: Users,      title:'Watchtower oversight',   desc:"Monitor the entire cohort's health from one command center, instantly surfacing loan-ready candidates.", color: CORAL },
]

// Demo chart data
const heroScoreData = [
  { month:'Oct', score:498 },{ month:'Nov', score:521 },{ month:'Dec', score:549 },
  { month:'Jan', score:580 },{ month:'Feb', score:610 },{ month:'Mar', score:648 },
  { month:'Apr', score:712 },
]

const cohortData = [
  { status:'Critical', count:12, fill: CORAL },
  { status:'At Risk',  count:23, fill: GOLD  },
  { status:'Ready',    count:31, fill: PGREEN },
]

const radialData = [{ name:'Complete', value:75, fill: PGREEN }]

function CountUp({ target, suffix='' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const numeric = parseFloat(target.replace(/[^0-9.]/g,''))
    const dur=1800, steps=60, inc=numeric/steps
    let cur=0
    const t=setInterval(()=>{cur+=inc;if(cur>=numeric){setCount(numeric);clearInterval(t)}else setCount(parseFloat(cur.toFixed(1)))}, dur/steps)
    return ()=>clearInterval(t)
  },[target])
  return <>{target.replace(/[\d.]+/, count)}</>
}

const CustomAreaTooltip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null
  const s=payload[0].value
  const color=s>=670?PGREEN:s>=580?GOLD:CORAL
  return (
    <div className="card px-4 py-3 text-sm shadow-lg border-0" style={{minWidth:100}}>
      <p className="text-xs mb-1" style={{color:'#6B7280'}}>{label}</p>
      <p className="font-display font-bold text-lg" style={{color}}>{s}</p>
    </div>
  )
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(()=>{const fn=()=>setScrolled(window.scrollY>40);window.addEventListener('scroll',fn);return ()=>window.removeEventListener('scroll',fn)},[])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{background:'#F9F5EF'}}>

      {/* ── Nav ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled?'bg-white/92 backdrop-blur-md border-b shadow-sm':''}` } style={scrolled?{borderColor:'#E3E6EC'}:{}}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-glow-sm" style={{background:TEAL}}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="10" cy="10" r="2.5" fill="#2FBF71"/>
                <circle cx="10" cy="10" r="1" fill="white"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-lg" style={{color:NAVY}}>MyScoreNova</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[['#how-it-works','How it works'],['#features','Features'],['#charts','See it in action'],['#testimonials','Stories']].map(([href,label])=>(
              <a key={href} href={href} className="text-sm transition-colors hover:opacity-70" style={{color:NAVY}}>{label}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium px-3 py-2 transition-colors" style={{color:NAVY}}>Sign in</Link>
            <Link to="/signup" className="btn-primary text-sm py-2 px-5 shadow-glow-sm">Get started <ArrowRight size={15}/></Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0" style={{background:'linear-gradient(150deg,#e6f4f4 0%,#F9F5EF 45%,#fef9e6 100%)'}} />
        <div className="absolute top-20 right-0 w-[700px] h-[700px] rounded-full blur-3xl -z-0 translate-x-1/3 pointer-events-none" style={{background:'rgba(6,106,111,0.07)'}}/>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl -z-0 -translate-x-1/3 pointer-events-none" style={{background:'rgba(244,176,0,0.08)'}}/>

        {/* Floating shapes */}
        <div className="absolute top-32 right-12 w-20 h-20 rounded-2xl border-2 rotate-12 animate-float hidden lg:block" style={{borderColor:'rgba(6,106,111,0.2)'}}/>
        <div className="absolute bottom-32 left-16 w-14 h-14 rounded-full border-2 animate-float hidden lg:block" style={{borderColor:'rgba(47,191,113,0.3)',animationDelay:'2s'}}/>

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="animate-fade-up">
            <div className="section-tag mb-8">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{background:PGREEN}}/>
              AI-powered homeownership program
            </div>
            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] mb-6" style={{color:NAVY}}>
              Your score.<br/>
              Your <span className="text-gradient-teal italic">nova</span>.<br/>
              Your home.
            </h1>
            <p className="text-lg leading-relaxed mb-10 max-w-lg" style={{color:'#6B7280'}}>
              MyScoreNova guides future homeowners from bad credit to loan-ready through AI coaching, class tracking, and automated financial routing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary text-base px-8 py-3.5 shadow-glow-teal">
                Start your journey <ArrowRight size={18}/>
              </Link>
              <a href="#how-it-works" className="btn-secondary text-base px-8 py-3.5">
                See how it works
              </a>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {['AJ','SK','MR','DC'].map((i,idx)=>(
                  <div key={idx} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-medium" style={{background:'#e6f4f4',color:TEAL}}>{i}</div>
                ))}
              </div>
              <p className="text-sm" style={{color:'#6B7280'}}><span className="font-medium" style={{color:NAVY}}>500+</span> participants on their path</p>
            </div>
          </div>

          {/* Hero card with live chart */}
          <div className="animate-fade-up animate-delay-200 hidden lg:block">
            <div className="relative">
              <div className="card p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider mb-0.5" style={{color:'#6B7280'}}>Score trajectory</p>
                    <p className="font-display text-xl font-semibold" style={{color:NAVY}}>+214 pts in 7 months</p>
                  </div>
                  <div className="badge-green"><div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:PGREEN}}/> Growing</div>
                </div>
                <ResponsiveContainer width="100%" height={140}>
                  <AreaChart data={heroScoreData} margin={{top:5,right:5,bottom:0,left:-20}}>
                    <defs>
                      <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={PGREEN} stopOpacity={0.25}/>
                        <stop offset="95%" stopColor={PGREEN} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{fontSize:10,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                    <YAxis domain={[460,760]} tick={{fontSize:10,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                    <Tooltip content={<CustomAreaTooltip/>}/>
                    <Area type="monotone" dataKey="score" stroke={PGREEN} strokeWidth={2.5} fill="url(#heroGrad)" dot={{r:4,fill:PGREEN,strokeWidth:0}} activeDot={{r:6}}/>
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[['Start','498',CORAL],['Now','712',PGREEN],['Goal','750+',TEAL]].map(([lbl,val,c])=>(
                    <div key={lbl} className="rounded-xl p-2.5 text-center" style={{background:'#F9F5EF'}}>
                      <p className="text-[10px] mb-0.5" style={{color:'#6B7280'}}>{lbl}</p>
                      <p className="font-display font-bold text-base" style={{color:c}}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Floating */}
              <div className="absolute -left-8 top-1/3 card p-3 shadow-lg animate-float" style={{animationDelay:'1s'}}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:'#fef9e6'}}><Zap size={13} style={{color:GOLD}}/></div>
                  <div><p className="text-[10px]" style={{color:'#6B7280'}}>AI coaching</p><p className="text-xs font-medium" style={{color:NAVY}}>New card ready</p></div>
                </div>
              </div>
              <div className="absolute -right-6 bottom-1/4 card p-3 shadow-lg animate-float" style={{animationDelay:'3s'}}>
                <p className="text-[10px] mb-0.5" style={{color:'#6B7280'}}>Loan gateway</p>
                <p className="text-xs font-medium" style={{color:PGREEN}}>🔓 Unlocked!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={20} style={{color:'rgba(16,42,67,0.3)'}}/>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{background:NAVY}} className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")"}}/>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s,i)=>(
              <div key={i} className="text-center">
                <p className="font-display text-4xl font-bold text-white mb-2"><CountUp target={s.value}/></p>
                <p className="text-sm" style={{color:'#4db2b2'}}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-tag mx-auto mb-4">The journey</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold mb-4" style={{color:NAVY}}>Four steps to your front door</h2>
          <p className="max-w-xl mx-auto" style={{color:'#6B7280'}}>An automated pipeline that cultivates mortgage-ready candidates from the ground up.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step,i)=>(
            <div key={i} className="card-hover p-6 group">
              <div className="font-mono text-5xl font-bold mb-4 leading-none transition-colors" style={{color:`${step.accent}22`}}>{step.number}</div>
              <div className="w-1 h-6 rounded-full mb-4 transition-all" style={{background:step.accent}}/>
              <h3 className="font-display text-lg font-semibold mb-2" style={{color:NAVY}}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Charts demo section ── */}
      <section id="charts" style={{background:'#F0EDE6'}} className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-4">Live analytics</div>
            <h2 className="font-display text-4xl font-bold mb-4" style={{color:NAVY}}>See your progress — visually</h2>
            <p className="max-w-xl mx-auto" style={{color:'#6B7280'}}>Rich dashboards give you and your counselor a clear picture of where you stand and where you're headed.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Score area chart */}
            <div className="chart-card lg:col-span-2">
              <p className="chart-title">Credit score over time</p>
              <p className="chart-sub">Monthly submissions tracked against Good credit threshold (670)</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={heroScoreData} margin={{top:5,right:10,bottom:0,left:-20}}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={PGREEN} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={PGREEN} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                  <YAxis domain={[460,760]} tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<CustomAreaTooltip/>}/>
                  <Area type="monotone" dataKey="score" stroke={PGREEN} strokeWidth={2.5} fill="url(#scoreGrad)"
                    dot={{r:5,fill:PGREEN,strokeWidth:0}} activeDot={{r:7}}/>
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs" style={{color:'#6B7280'}}>
                  <div className="w-3 h-0.5 rounded" style={{background:PGREEN}}/>Score path
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{color:'#6B7280'}}>
                  <div className="w-3 h-0.5 rounded border-t-2 border-dashed" style={{borderColor:TEAL}}/>670 threshold
                </div>
              </div>
            </div>

            {/* Cohort bar chart */}
            <div className="chart-card">
              <p className="chart-title">Cohort breakdown</p>
              <p className="chart-sub">Participants by credit status</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cohortData} margin={{top:5,right:10,bottom:5,left:-20}}>
                  <XAxis dataKey="status" tick={{fontSize:10,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                  <Tooltip cursor={{fill:'rgba(0,0,0,0.03)'}} formatter={(v)=>[v,'Participants']}/>
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {cohortData.map((entry,i)=><Cell key={i} fill={entry.fill}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Progress radial */}
            <div className="chart-card flex flex-col items-center justify-center text-center">
              <p className="chart-title w-full text-left">Curriculum progress</p>
              <p className="chart-sub w-full text-left">Classes completed this cohort</p>
              <ResponsiveContainer width="100%" height={160}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" data={radialData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={8} fill={PGREEN} background={{fill:'#E3E6EC'}}/>
                </RadialBarChart>
              </ResponsiveContainer>
              <p className="font-display text-4xl font-bold mt-2" style={{color:NAVY}}>75%</p>
              <p className="text-xs mt-1" style={{color:'#6B7280'}}>Average class completion</p>
            </div>

            {/* Score distribution histogram */}
            <div className="chart-card lg:col-span-2">
              <p className="chart-title">Score distribution histogram</p>
              <p className="chart-sub">Number of participants in each score range</p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={[
                  {range:'300–399',count:2,fill:CORAL},{range:'400–499',count:5,fill:CORAL},
                  {range:'500–579',count:8,fill:CORAL},{range:'580–619',count:10,fill:GOLD},
                  {range:'620–669',count:14,fill:GOLD},{range:'670–719',count:18,fill:PGREEN},
                  {range:'720–779',count:9,fill:PGREEN},{range:'780–850',count:4,fill:TEAL},
                ]} margin={{top:5,right:10,bottom:5,left:-20}}>
                  <XAxis dataKey="range" tick={{fontSize:9,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:10,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
                  <Tooltip cursor={{fill:'rgba(0,0,0,0.03)'}} formatter={(v)=>[v,'Participants']}/>
                  <Bar dataKey="count" radius={[4,4,0,0]}>
                    {[CORAL,CORAL,CORAL,GOLD,GOLD,PGREEN,PGREEN,TEAL].map((c,i)=><Cell key={i} fill={c}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── Credit triage ── */}
      <section className="py-24 max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="section-tag mx-auto mb-4">Intelligent routing</div>
          <h2 className="font-display text-4xl font-bold" style={{color:NAVY}}>The credit triage engine</h2>
        </div>
        <div className="card p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="card px-6 py-4 font-medium text-center whitespace-nowrap shrink-0" style={{color:NAVY,background:'#F9F5EF'}}>Monthly score input</div>
            <div className="text-2xl hidden lg:block" style={{color:'#E3E6EC'}}>→</div>
            <div className="flex flex-col gap-4 flex-1 w-full">
              {[
                [CORAL,'Bad credit (< 580)','Routes to aggressive AI credit rehabilitation & dispute automation'],
                [GOLD,'Low credit (580–669)','Routes to targeted AI debt-management coaching modules'],
                [PGREEN,'Good credit (670+)','Routes automatically to the Loan Assistance Gateway'],
              ].map(([c,label,action])=>(
                <div key={label} className="flex items-center gap-4 p-4 rounded-xl border hover:border-opacity-50 transition-colors" style={{background:'#F9F5EF',borderColor:'#E3E6EC'}}>
                  <div className="w-3 h-3 rounded-full shrink-0" style={{background:c}}/>
                  <span className="font-medium text-sm w-44 shrink-0" style={{color:NAVY}}>{label}</span>
                  <span className="text-sm" style={{color:'#6B7280'}}>{action}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-xs mt-8" style={{color:'#6B7280'}}>Replaces manual file reviews with automated, color-coded status triggers</p>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" style={{background:'#F0EDE6'}} className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="section-tag mx-auto mb-4">Platform features</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold" style={{color:NAVY}}>Built for real results</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f,i)=>(
              <div key={i} className="card-hover p-6 group">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-5 transition-opacity" style={{background:`${f.color}18`}}>
                  <f.icon size={20} style={{color:f.color}}/>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2" style={{color:NAVY}}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{color:'#6B7280'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" style={{background:NAVY}} className="py-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl" style={{background:'rgba(6,106,111,0.15)'}}/>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium mb-4" style={{borderColor:'rgba(6,106,111,0.4)',background:'rgba(6,106,111,0.15)',color:'#4db2b2'}}>
              <Star size={14} fill="currentColor"/> Real stories
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white">Their path. Their home.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {q:'"I went from a 498 to a 712 in seven months. The coaching cards told me exactly what to do."',n:'Alex J.',s:'498 → 712',m:'7 months',i:'AJ'},
              {q:'"When the Loan Gateway finally unlocked, I cried. Closing on my house next month."',n:'Sarah K.',s:'621 → 745',m:'9 months',i:'SK'},
              {q:'"As a counselor, the Watchtower dashboard cut my review time from hours to minutes."',n:'Counselor T.',s:'Admin view',m:'Staff',i:'CT'},
            ].map((t,i)=>(
              <div key={i} className="rounded-2xl p-8 hover:bg-white/8 transition-colors" style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)'}}>
                <p className="text-sm leading-relaxed mb-6 italic font-display" style={{color:'rgba(255,255,255,0.8)'}}>{t.q}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium" style={{background:TEAL,color:'white'}}>{t.i}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.n}</p>
                    <p className="text-xs" style={{color:'#4db2b2'}}>{t.s} · {t.m}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 max-w-4xl mx-auto px-6 text-center">
        <div className="section-tag mx-auto mb-8">Ready to begin?</div>
        <h2 className="font-display text-5xl lg:text-6xl font-bold mb-6" style={{color:NAVY}}>
          Your front door<br/><span className="text-gradient-teal italic">is waiting</span>
        </h2>
        <p className="text-lg mb-10 max-w-xl mx-auto" style={{color:'#6B7280'}}>Join hundreds of future homeowners building their path one credit point at a time.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/signup" className="btn-primary text-base px-10 py-4 shadow-glow-teal">Create your account <ArrowRight size={18}/></Link>
          <Link to="/login" className="btn-secondary text-base px-10 py-4">Sign in instead</Link>
        </div>
        <p className="text-xs mt-6" style={{color:'#6B7280'}}>Demo: <span className="font-mono">alex@demo.com</span> / <span className="font-mono">demo123</span> · Admin: <span className="font-mono">admin@pto.com</span> / <span className="font-mono">admin123</span></p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-8" style={{borderColor:'#E3E6EC'}}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{background:TEAL}}>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none"><path d="M10 2L17 6.5V13.5L10 18L3 13.5V6.5L10 2Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="10" cy="10" r="2" fill="#2FBF71"/></svg>
            </div>
            <span className="text-sm font-display font-semibold" style={{color:NAVY}}>MyScoreNova</span>
          </div>
          <p className="text-xs" style={{color:'#6B7280'}}>© 2025 MyScoreNova by Tina Patton Consulting. AI Credit & Class Management.</p>
        </div>
      </footer>
    </div>
  )
}