import { useState } from 'react'
import { PlusCircle, Upload, Save, Trash2, Clock, BookOpen, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

// Theme Constants
const NAVY = '#102A43'
const TEAL = '#066A6F'
const PGREEN = '#2FBF71'
const CORAL = '#F56A6A'

export default function AdminCBTPage() {
  const { api } = useAuth()
  const [subject, setSubject] = useState('')
  const [timeLapse, setTimeLapse] = useState(30)
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState({
    text: '',
    options: { A: '', B: '', C: '', D: '' },
    correctAnswer: 'A'
  })

  const addQuestion = () => {
    if (!currentQ.text || !currentQ.options.A || !currentQ.options.B) return
    setQuestions([...questions, { ...currentQ, id: Date.now() }])
    setCurrentQ({ text: '', options: { A: '', B: '', C: '', D: '' }, correctAnswer: 'A' })
  }

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const saveCBT = async () => {
    try {
      const cbtData = { subject, timeLapsMinutes: timeLapse, questions }
      await api.post('/cbt-tests', cbtData)
      alert('CBT Questions configured and saved to API successfully!')
      setSubject('')
      setQuestions([])
    } catch {
      alert('Error saving CBT Test')
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-4xl font-bold tracking-tight mb-2" style={{color: NAVY}}>CBT Configuration</h1>
        <p className="font-medium opacity-60" style={{color: NAVY}}>Upload questions and set test parameters for participants.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Test Settings */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card p-6 border-t-4" style={{borderTopColor: TEAL}}>
            <h3 className="font-bold text-lg mb-4" style={{color: NAVY}}>General Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Subject</label>
                <div className="relative">
                  <BookOpen size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={subject} onChange={e => setSubject(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20"
                    placeholder="e.g. Financial Literacy" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Time Lapse (Minutes)</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="number" min="1" value={timeLapse} onChange={e => setTimeLapse(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20"
                    placeholder="30" />
                </div>
              </div>
            </div>

            <button onClick={saveCBT} disabled={questions.length === 0 || !subject}
              className="mt-6 w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              style={{background: TEAL}}>
              <Save size={18} /> Save & Publish CBT
            </button>
          </div>
        </div>

        {/* Question Upload */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4" style={{color: NAVY}}>Add Question</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Question Text</label>
                <textarea rows="3" value={currentQ.text} onChange={e => setCurrentQ({...currentQ, text: e.target.value})}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20"
                  placeholder="Enter the question here..."></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {['A', 'B', 'C', 'D'].map(opt => (
                  <div key={opt}>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Option {opt}</label>
                    <input type="text" value={currentQ.options[opt]} onChange={e => setCurrentQ({...currentQ, options: {...currentQ.options, [opt]: e.target.value}})}
                      className="w-full p-2.5 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20"
                      placeholder={`Option ${opt}`} />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">Correct Answer</label>
                <div className="flex gap-4">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <label key={opt} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="correct" value={opt} checked={currentQ.correctAnswer === opt}
                        onChange={e => setCurrentQ({...currentQ, correctAnswer: e.target.value})} className="text-teal-600 focus:ring-teal-500" />
                      <span className="text-sm font-medium">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={addQuestion} className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2"
                  style={{background: `${PGREEN}15`, color: PGREEN}}>
                  <PlusCircle size={16} /> Add to List
                </button>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 flex justify-between items-center" style={{color: NAVY}}>
              Question Pool
              <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">{questions.length} Questions</span>
            </h3>
            <div className="space-y-3">
              {questions.length === 0 ? (
                <div className="text-center py-10 opacity-50">
                  <Upload size={32} className="mx-auto mb-3" />
                  <p className="text-sm font-medium">No questions added yet.</p>
                </div>
              ) : (
                questions.map((q, i) => (
                  <div key={q.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 flex justify-between gap-4 group">
                    <div className="min-w-0">
                      <p className="font-bold text-sm mb-2" style={{color: NAVY}}><span className="text-teal-600 mr-2">Q{i+1}.</span>{q.text}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <span>A: {q.options.A}</span>
                        <span>B: {q.options.B}</span>
                        <span>C: {q.options.C}</span>
                        <span>D: {q.options.D}</span>
                      </div>
                      <p className="text-xs font-bold mt-2" style={{color: PGREEN}}>Correct: Option {q.correctAnswer}</p>
                    </div>
                    <button onClick={() => removeQuestion(q.id)} className="text-gray-400 hover:text-red-500 transition-colors h-fit p-2">
                       <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
