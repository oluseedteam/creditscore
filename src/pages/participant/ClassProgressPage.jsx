import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { CheckCircle, Award, PlayCircle, BookOpen, Paperclip, X } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const TEAL='#066A6F', NAVY='#102A43', PGREEN='#2FBF71', GOLD='#F4B000', CORAL='#F56A6A'

// Dummy weekly attendance until backend fully supports weekly tracking
const weeklyAtt = [
  {week:'W1',present:1,absent:0},{week:'W2',present:1,absent:0},{week:'W3',present:1,absent:0},
  {week:'W4',present:0,absent:1},{week:'W5',present:1,absent:0},{week:'W6',present:1,absent:0},
  {week:'W7',present:0,absent:1},{week:'W8',present:1,absent:0},
]

export default function ClassProgressPage() {
  const { user, api } = useAuth()
  const [curriculum, setCurriculum] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState(null)

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get('/curriculum-frameworks')
        const data = res.data.map(c => ({
          ...c,
          completed: false // Until you track module completion per user
        }))
        setCurriculum(data.sort((a,b) => a.week - b.week))
      } catch {
        console.error('Failed to load frameworks')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [api])

  const att = user?.attendance || {attended:0,total:0}
  const pct = att.total>0 ? Math.round((att.attended/att.total)*100) : 0
  const completed = curriculum.filter(c=>c.completed).length
  const radialData = [{value:pct,fill:pct>=75?PGREEN:pct>=50?GOLD:CORAL}]
  const currPct = curriculum.length>0 ? Math.round(completed/curriculum.length*100) : 0

  if (loading) {
    return <div className="p-10 text-center"><div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"/></div>
  }

  return (
    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className="p-6 lg:p-10 max-w-5xl print:p-0">
      <div className="mb-8 flex justify-between items-start flex-wrap gap-4 print:mb-0">
        <div>
          <h1 className="font-display text-4xl font-bold mb-2 tracking-tight" style={{color:NAVY}}>Class Progress</h1>
          <p className="font-medium opacity-60" style={{color:NAVY}}>Educational tracking for your homeownership journey.</p>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 rounded-2xl text-sm font-bold shadow-sm hover:border-teal-500 hover:text-teal-600 transition-all print:hidden">
          <Award size={18} className="text-teal-600" /> Export Progress Report
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {label:'Attendance Rate',     value:`${pct}%`,             sub:`${att.attended} of ${att.total} classes`},
          {label:'Modules Validated',   value:`${completed}/${curriculum.length}`, sub:'curriculum modules'},
          {label:'Program Completion',  value:`${currPct}%`,         sub:'overall progress'},
          {label:'Scheduled Topic',     value:curriculum[completed] ? `Week ${curriculum[completed].week}` : 'Finished', sub:curriculum[completed]?.title?.split(' ').slice(0,2).join(' ')+'…' || 'All done!'},
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
        <div className="p-5 border-b flex justify-between items-center" style={{borderColor:'#E3E6EC'}}>
          <h2 className="font-display font-semibold" style={{color:NAVY}}>Curriculum Framework</h2>
        </div>
        <div>
          {curriculum.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No curriculum modules available yet.</div>
          ) : (curriculum.map(week=>(
            <div key={week.id} className="flex gap-4 p-5 border-b last:border-0 transition-colors"
              style={{borderColor:'#F9F5EF',background:week.completed?'white':'#FAFAF8'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{background:week.completed?`${PGREEN}18`:'#E3E6EC'}}>
                {week.completed
                  ? <CheckCircle size={20} style={{color:PGREEN}}/>
                  : <span className="font-mono text-sm font-medium" style={{color:'#6B7280'}}>{week.week}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm" style={{color:week.completed?NAVY:'#6B7280'}}>Week {week.week}: {week.title}</p>
                    {week.completed&&<span className="badge-green text-xs">Validated</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    {week.file_path && (
                      <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/storage/${week.file_path}`} 
                         target="_blank" rel="noreferrer"
                         className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg hover:bg-orange-100 transition-colors">
                        <Paperclip size={12} /> Download PDF
                      </a>
                    )}
                    {week.content && (
                      <button onClick={() => setSelectedModule(week)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg hover:bg-teal-100 transition-colors">
                        <BookOpen size={12} /> Read Notes
                      </button>
                    )}
                    {week.cbt_test_id && (
                      <Link to="/quiz" state={{ autoStartId: week.cbt_test_id }} className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                        <PlayCircle size={12} /> Take CBT
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(week.topics || []).map(t=>(
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{background:'#F0EDE6',color:'#6B7280'}}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>

      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
            <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.9}}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden relative">
              <button onClick={() => setSelectedModule(null)} className="absolute right-6 top-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-navy-900 transition-colors z-10">
                <X size={20} />
              </button>
              <div className="p-8 border-b bg-gray-50">
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">Week {selectedModule.week} Module</p>
                <h3 className="text-2xl font-bold" style={{color: NAVY}}>{selectedModule.title}</h3>
              </div>
              <div className="p-8 overflow-y-auto text-gray-600 leading-relaxed whitespace-pre-wrap">
                {selectedModule.content}
              </div>
              <div className="p-6 border-t bg-gray-50 flex justify-end">
                <button onClick={() => setSelectedModule(null)} className="px-6 py-2 bg-navy-900 text-white rounded-xl font-bold text-sm">Close Reader</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {curriculum.length > 0 && completed===curriculum.length&&(
        <div className="card p-8 text-center" style={{background:'#e8faf0',borderColor:`${PGREEN}40`}}>
          <Award className="mx-auto mb-4" size={48} style={{color:PGREEN}}/>
          <h3 className="font-display text-2xl font-bold mb-2" style={{color:NAVY}}>Program Complete</h3>
          <p style={{color:'#6B7280'}}>The full homeownership curriculum has been successfully validated.</p>
        </div>
      )}
    </motion.div>
  )
}