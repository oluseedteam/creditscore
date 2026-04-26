import { useAuth } from '../../context/AuthContext'
import { CheckCircle, XCircle, BookOpen, Award } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadialBarChart, RadialBar } from 'recharts'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71', GOLD='#F4B000', CORAL='#F56A6A'

const curriculum = [
  {week:1, title: 'Introduction to Homeownership',   topics:['The homebuying timeline','Understanding your credit report','Setting goals'],                  completed:true},
  {week:2, title: 'Credit Fundamentals',             topics:['Credit score factors','Reading a credit report','Dispute process'],                            completed:true},
  {week:3, title: 'Debt Management',                 topics:['Debt-to-income ratio','Payoff strategies','Utilization tactics'],                            completed:true},
  {week:4, title: 'Saving for a Down Payment',       topics:['Down payment options','Emergency fund basics','Budget building'],                            completed:true},
  {week:5, title: 'Mortgage Basics',                 topics:['Loan types overview','Fixed vs. adjustable rates','Prequalification'],                         completed:false},
  {week:6, title: 'FHA & Conventional Loans',        topics:['FHA requirements','PMI explained','Loan comparison'],                                         completed:false},
  {week:7, title: 'The Home Search Process',         topics:['Working with agents','Making offers','Inspection basics'],                                     completed:false},
  {week:8, title: 'Closing & Beyond',                topics:['Closing costs','Title and escrow','Post-closing steps'],                                     completed:false},
]

// Weekly attendance tracking data
const weeklyAtt = [
  {week:'W1',present:1,absent:0},{week:'W2',present:1,absent:0},{week:'W3',present:1,absent:0},
  {week:'W4',present:0,absent:1},{week:'W5',present:1,absent:0},{week:'W6',present:1,absent:0},
  {week:'W7',present:0,absent:1},{week:'W8',present:1,absent:0},
]

export default function ClassProgressPage() {
  const { user } = useAuth()
  const att = user?.attendance || {attended:0,total:0}
  const pct = att.total>0 ? Math.round((att.attended/att.total)*100) : 0
  const completed = curriculum.filter(c=>c.completed).length
  const radialData = [{value:pct,fill:pct>=75?PGREEN:pct>=50?GOLD:CORAL}]
  const currPct = Math.round(completed/curriculum.length*100)

  return (
    <div className="p-6 lg:p-10 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-1" style={{color:NAVY}}>Class Progress</h1>
        <p style={{color:'#6B7280'}}>Educational tracking for your homeownership journey.</p>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {label:'Attendance Rate',     value:`${pct}%`,             sub:`${att.attended} of ${att.total} classes`},
          {label:'Modules Validated',   value:`${completed}/8`,      sub:'curriculum modules'},
          {label:'Program Completion',  value:`${currPct}%`,         sub:'overall progress'},
          {label:'Scheduled Topic',     value:`Week ${completed+1}`, sub:curriculum[completed]?.title?.split(' ').slice(0,2).join(' ')+'…'},
        ].map((s,i)=>(
          <div key={i} className="card p-4">
            <p className="text-xs mb-1" style={{color:'#6B7280'}}>{s.label}</p>
            <p className="font-display text-2xl font-bold" style={{color:NAVY}}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{color:'#6B7280'}}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress Visualization */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Attendance Metric */}
        <div className="chart-card flex flex-col items-center justify-center text-center">
          <p className="chart-title w-full text-left">Attendance Metric</p>
          <p className="chart-sub w-full text-left">Program requirement: 75% threshold</p>
          <ResponsiveContainer width="100%" height={150}>
            <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="80%" data={radialData} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={8} fill={radialData[0].fill} background={{fill:'#E3E6EC'}}/>
            </RadialBarChart>
          </ResponsiveContainer>
          <p className="font-display text-4xl font-bold" style={{color:pct>=75?PGREEN:pct>=50?GOLD:CORAL}}>{pct}%</p>
          <p className="text-xs mt-1" style={{color:'#6B7280'}}>{pct>=75?'✓ Requirement Verified':'Below 75% Threshold'}</p>
        </div>

        {/* Attendance Timeline */}
        <div className="chart-card lg:col-span-2">
          <p className="chart-title">Attendance Timeline</p>
          <p className="chart-sub">Status verification across weekly modules</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={weeklyAtt} margin={{top:5,right:10,bottom:0,left:-20}} barSize={16}>
              <XAxis dataKey="week" tick={{fontSize:11,fill:'#6B7280'}} axisLine={false} tickLine={false}/>
              <YAxis hide domain={[0,1]}/>
              <Tooltip formatter={(v,n)=>[v===1?'Present':'Absent',n==='present'?'Status':'Deviation']}/>
              <Bar dataKey="present"   radius={[4,4,0,0]} fill={PGREEN}/>
              <Bar dataKey="absent"    radius={[4,4,0,0]} fill={CORAL} fillOpacity={0.6}/>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[[PGREEN,'Present'],[CORAL,'Absent']].map(([c,l])=>(
              <div key={l} className="flex items-center gap-1.5 text-xs" style={{color:'#6B7280'}}>
                <div className="w-3 h-2 rounded-sm" style={{background:c}}/>{l}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curriculum Framework */}
      <div className="card overflow-hidden mb-8">
        <div className="p-5 border-b" style={{borderColor:'#E3E6EC'}}>
          <h2 className="font-display font-semibold" style={{color:NAVY}}>Curriculum Framework</h2>
        </div>
        <div>
          {curriculum.map((week,i)=>(
            <div key={week.week} className="flex gap-4 p-5 border-b last:border-0 transition-colors"
              style={{borderColor:'#F9F5EF',background:week.completed?'white':'#FAFAF8'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{background:week.completed?`${PGREEN}18`:'#E3E6EC'}}>
                {week.completed
                  ? <CheckCircle size={20} style={{color:PGREEN}}/>
                  : <span className="font-mono text-sm font-medium" style={{color:'#6B7280'}}>{week.week}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="font-medium text-sm" style={{color:week.completed?NAVY:'#6B7280'}}>Week {week.week}: {week.title}</p>
                  {week.completed&&<span className="badge-green text-xs">Validated</span>}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {week.topics.map(t=>(
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{background:'#F0EDE6',color:'#6B7280'}}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {completed===curriculum.length&&(
        <div className="card p-8 text-center" style={{background:'#e8faf0',borderColor:`${PGREEN}40`}}>
          <Award className="mx-auto mb-4" size={48} style={{color:PGREEN}}/>
          <h3 className="font-display text-2xl font-bold mb-2" style={{color:NAVY}}>Program Complete</h3>
          <p style={{color:'#6B7280'}}>The full homeownership curriculum has been successfully validated.</p>
        </div>
      )}
    </div>
  )
}