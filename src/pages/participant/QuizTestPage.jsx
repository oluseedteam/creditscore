import { useState, useEffect } from 'react'
import { Clock, CheckCircle, AlertTriangle, ChevronRight, Check } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Theme Constants
const NAVY = '#102A43'
const TEAL = '#066A6F'
const PGREEN = '#2FBF71'
const CORAL = '#F56A6A'

export default function QuizTestPage() {
  const { api } = useAuth()
  const [mockTest, setMockTest] = useState(null)
  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const fetchTest = async () => {
       try {
         const res = await api.get('/cbt-tests')
         if (res.data.length > 0) {
           const testId = res.data[0].id
           const testData = await api.get('/cbt-tests/' + testId)
           const fixedOptionsTest = {
             ...testData.data,
             questions: testData.data.questions.map(q => ({
               id: q.id,
               text: q.text,
               options: { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d },
               correctAnswer: q.correct_answer
             }))
           }
           setMockTest(fixedOptionsTest)
           setTimeLeft(fixedOptionsTest.timeLapsMinutes * 60)
         }
       } catch (e) { console.error('No tests available') }
    }
    if (!mockTest) fetchTest()

    let timer;
    if (started && !completed && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            finishTest()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [started, completed, mockTest, api, timeLeft])

  const finishTest = () => {
    let finalScore = 0
    mockTest.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) finalScore++
    })
    setScore(finalScore)
    setCompleted(true)
    // Results POST API goes here
  }

  const handleSelect = (qId, optionKey) => {
    setAnswers({ ...answers, [qId]: optionKey })
  }

  const handleNext = () => {
    if (currentIdx < mockTest.questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
    } else {
      finishTest()
    }
  }

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (!mockTest) {
     return <div className="p-10 text-center font-bold text-gray-500">Loading CBT Tests...</div>
  }

  if (completed) {
    const pass = (score / mockTest.questions.length) >= 0.5
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto text-center mt-10">
        <div className="card p-10 space-y-6 inline-flex flex-col items-center shadow-xl border-t-8" style={{borderColor: pass ? PGREEN : CORAL}}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg" 
               style={{background: pass ? `${PGREEN}15` : `${CORAL}15`, color: pass ? PGREEN : CORAL}}>
            {pass ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
          </div>
          <h1 className="font-display text-3xl font-bold" style={{color: NAVY}}>Test Completed!</h1>
          <p className="text-gray-500 font-medium pb-4 border-b w-full">You have finished the {mockTest.subject}</p>
          <div className="text-center w-full">
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Final Score</p>
            <p className="text-6xl font-black" style={{color: pass ? PGREEN : CORAL}}>
              {score} <span className="text-2xl text-gray-300">/ {mockTest.questions.length}</span>
            </p>
          </div>
          <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 rounded-xl font-bold text-white shadow-md transition-all relative overflow-hidden group" style={{background: NAVY}}>
            <span className="relative z-10">Return to Dashboard</span>
            <div className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100" style={{background: TEAL}}></div>
          </button>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="p-6 lg:p-10 max-w-4xl mx-auto h-full flex flex-col justify-center items-center mt-20">
        <div className="card p-10 max-w-lg text-center space-y-6 shadow-2xl relative overflow-hidden border-none" style={{background: NAVY}}>
           <div className="absolute inset-0 opacity-10" style={{background: 'radial-gradient(circle at 50% -20%, #2FBF71, transparent 70%)'}}></div>
           <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                 <Clock size={32} className="text-emerald-400" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white mb-2">{mockTest.subject}</h1>
              <p className="text-gray-300 font-medium mb-8">This is a Computer Based Test. The questions will be displayed randomly. Once started, the timer cannot be paused.</p>
              
              <div className="flex bg-white/5 rounded-xl p-4 divide-x divide-white/10 mb-8 border border-white/10">
                 <div className="flex-1 px-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Time Lapse</p>
                    <p className="text-xl font-bold text-white">{mockTest.timeLapsMinutes} mins</p>
                 </div>
                 <div className="flex-1 px-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Questions</p>
                    <p className="text-xl font-bold text-white">{mockTest.questions.length}</p>
                 </div>
              </div>

              <button onClick={() => setStarted(true)} 
                className="w-full py-4 rounded-xl font-bold text-lg text-navy-900 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-900/50">
                Start Test Now
              </button>
           </div>
        </div>
      </div>
    )
  }

  const currentQ = mockTest.questions[currentIdx]

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="font-bold" style={{color: NAVY}}>{mockTest.subject}</h2>
          <p className="text-xs font-medium text-gray-500">Question {currentIdx + 1} of {mockTest.questions.length}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg shadow-inner"
             style={{background: timeLeft < 60 ? `${CORAL}15` : '#f8fafc', color: timeLeft < 60 ? CORAL : NAVY}}>
          <Clock size={16} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-300 rounded-full" 
             style={{width: `${((currentIdx + 1) / mockTest.questions.length) * 100}%`, background: TEAL}}></div>
      </div>

      <div className="card p-8 min-h-[400px] flex flex-col">
        <h3 className="text-xl font-medium leading-relaxed mb-8" style={{color: NAVY}}>
          {currentQ.text}
        </h3>

        <div className="space-y-3 mt-auto">
          {Object.entries(currentQ.options).map(([key, value]) => {
            const isSelected = answers[currentQ.id] === key
            return (
              <button key={key} onClick={() => handleSelect(currentQ.id, key)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                  isSelected ? 'border-teal-500 bg-teal-50/50' : 'border-gray-100 hover:border-teal-200 bg-white'
                }`}>
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm transition-colors ${
                    isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-teal-100'
                  }`}>
                    {key}
                  </span>
                  <span className={`font-medium ${isSelected ? 'text-teal-900' : 'text-gray-700'}`}>{value}</span>
                </div>
                {isSelected && <Check size={20} className="text-teal-500" />}
              </button>
            )
          })}
        </div>

        <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
          <button onClick={handleNext} disabled={!answers[currentQ.id]}
            className="px-8 py-3 rounded-xl font-bold text-white transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{background: TEAL}}>
            {currentIdx === mockTest.questions.length - 1 ? 'Submit Test' : 'Next Question'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
