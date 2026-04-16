import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, TrendingUp, Shield, Users, Star, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'

const stats = [
  { value: '94%', label: 'Completion rate' },
  { value: '127pts', label: 'Avg. score gain' },
  { value: '3.2mo', label: 'Avg. to Good credit' },
  { value: '500+', label: 'Homeowners created' },
]

const steps = [
  {
    number: '01',
    title: 'Enroll & attend classes',
    desc: 'Join our structured homeownership curriculum. Track attendance automatically and earn progress milestones.',
    color: 'forest',
  },
  {
    number: '02',
    title: 'Submit monthly scores',
    desc: 'Upload your credit score each month. Our AI engine analyzes your standing and triggers the right coaching path.',
    color: 'forest',
  },
  {
    number: '03',
    title: 'Get AI coaching',
    desc: 'Receive a personalized Coaching Card each month — step-by-step guidance to repair, rebuild, and elevate your credit.',
    color: 'forest',
  },
  {
    number: '04',
    title: 'Unlock the loan gateway',
    desc: 'Hit Good credit status and your Loan Assistance module unlocks automatically — connect directly with a loan officer.',
    color: 'forest',
  },
]

const features = [
  {
    icon: TrendingUp,
    title: 'Credit triage engine',
    desc: 'Automated color-coded routing replaces manual file reviews. Bad, Low, or Good — the system responds instantly.',
  },
  {
    icon: Shield,
    title: 'Data privacy by design',
    desc: 'Participants own their data with full read/write access. Admins get read-only visibility — zero risk of modifications.',
  },
  {
    icon: Users,
    title: 'Watchtower oversight',
    desc: "Administrators monitor the entire cohort's health from one command center, instantly surfacing loan-ready candidates.",
  },
]

const testimonials = [
  {
    quote: "I went from a 498 to a 712 in seven months. The coaching cards were the difference — they told me exactly what to do.",
    name: 'Alex J.',
    score: '498 → 712',
    months: '7 months',
    initials: 'AJ',
  },
  {
    quote: "The platform gamified everything. When the Loan Gateway finally unlocked, I actually cried. I'm closing on my house next month.",
    name: 'Sarah K.',
    score: '621 → 745',
    months: '9 months',
    initials: 'SK',
  },
  {
    quote: "As a counselor, the Watchtower dashboard cut my review time from hours to minutes. I can now focus on the people who need help.",
    name: 'Counselor T.',
    score: 'Admin view',
    months: 'Staff',
    initials: 'CT',
  },
]

function CountUp({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const numeric = parseInt(target.replace(/\D/g, ''))
    const dur = 1800
    const steps = 60
    const inc = numeric / steps
    let cur = 0
    const timer = setInterval(() => {
      cur += inc
      if (cur >= numeric) { setCount(numeric); clearInterval(timer) }
      else setCount(Math.floor(cur))
    }, dur / steps)
    return () => clearInterval(timer)
  }, [target])
  return <>{target.replace(/[\d.]+/, count)}</>
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="min-h-screen bg-cream-50 overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-cream-200 shadow-sm' : ''}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/>
                <circle cx="9" cy="9" r="2.5" fill="white"/>
              </svg>
            </div>
            <span className="font-display font-semibold text-navy-900 text-lg">Path to Ownership</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-navy-800 hover:text-forest-600 transition-colors">How it works</a>
            <a href="#features" className="text-sm text-navy-800 hover:text-forest-600 transition-colors">Features</a>
            <a href="#testimonials" className="text-sm text-navy-800 hover:text-forest-600 transition-colors">Stories</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-navy-800 hover:text-forest-600 transition-colors px-3 py-2">Sign in</Link>
            <Link to="/signup" className="btn-primary text-sm py-2 px-5">Get started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cream-50 via-cream-100 to-forest-50 -z-10" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-forest-100/40 blur-3xl -z-10 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-cream-300/50 blur-3xl -z-10 -translate-x-1/3" />

        {/* Floating shapes */}
        <div className="absolute top-32 right-16 w-24 h-24 rounded-2xl border-2 border-forest-200/60 rotate-12 animate-float hidden lg:block" />
        <div className="absolute bottom-32 left-16 w-16 h-16 rounded-full border-2 border-forest-300/40 animate-float hidden lg:block" style={{animationDelay:'2s'}} />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 rounded-full bg-forest-400/60 animate-pulse-slow" />

        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up">
            <div className="section-tag mb-8">
              <div className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
              AI-powered homeownership program
            </div>
            <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold text-navy-900 leading-[1.08] mb-6">
              Architecting<br />
              the <span className="text-gradient italic">path</span><br />
              to ownership
            </h1>
            <p className="text-lg text-navy-800/70 leading-relaxed mb-10 max-w-lg">
              From bad credit to loan-ready. Our AI engine guides homebuyers through credit rehabilitation, class attendance, and financial conversion — automatically.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary text-base px-8 py-3.5 shadow-glow-forest">
                Start your journey <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn-secondary text-base px-8 py-3.5">
                See how it works
              </a>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex -space-x-2">
                {['AJ','SK','MR','DC'].map((i, idx) => (
                  <div key={idx} className="w-8 h-8 rounded-full bg-forest-200 border-2 border-white flex items-center justify-center text-[10px] font-medium text-forest-800">{i}</div>
                ))}
              </div>
              <p className="text-sm text-navy-800/60"><span className="font-medium text-navy-900">500+</span> participants on their path</p>
            </div>
          </div>

          {/* Hero card */}
          <div className="animate-fade-up animate-delay-200 hidden lg:block">
            <div className="relative">
              <div className="card p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs text-navy-800/50 uppercase tracking-wider mb-1">Your progress</p>
                    <p className="font-display text-2xl font-semibold text-navy-900">Growing strong</p>
                  </div>
                  <div className="badge-green">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
                    Active
                  </div>
                </div>

                {/* Score bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-sm text-navy-800/60">Credit score</span>
                    <span className="font-mono font-medium text-forest-700 text-xl">712</span>
                  </div>
                  <div className="h-3 bg-cream-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-forest-400 to-forest-600 rounded-full" style={{width:'72%'}} />
                  </div>
                  <div className="flex justify-between mt-1.5 text-[10px] text-navy-800/40">
                    <span>300</span><span>580</span><span>670</span><span>850</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-cream-100 rounded-xl p-3">
                    <p className="text-xs text-navy-800/50 mb-1">Classes attended</p>
                    <p className="font-semibold text-navy-900">6 / 8</p>
                  </div>
                  <div className="bg-forest-50 rounded-xl p-3">
                    <p className="text-xs text-forest-700/70 mb-1">Score this month</p>
                    <p className="font-semibold text-forest-800">+28 pts</p>
                  </div>
                </div>

                <div className="bg-forest-600 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="text-forest-200 shrink-0" size={20} />
                  <div>
                    <p className="text-white text-sm font-medium">Loan gateway unlocked!</p>
                    <p className="text-forest-200 text-xs mt-0.5">Connect with a loan officer today</p>
                  </div>
                </div>
              </div>

              {/* Floating mini cards */}
              <div className="absolute -left-8 top-1/3 card p-3 shadow-lg animate-float" style={{animationDelay:'1s'}}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <TrendingUp size={14} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="text-[10px] text-navy-800/50">AI Coaching</p>
                    <p className="text-xs font-medium text-navy-900">New card ready</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-6 bottom-1/4 card p-3 shadow-lg animate-float" style={{animationDelay:'3s'}}>
                <p className="text-[10px] text-navy-800/50 mb-1">Next class</p>
                <p className="text-xs font-medium text-navy-900">Thursday 6pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={20} className="text-navy-800/30" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-forest-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-grain" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="font-display text-4xl font-bold text-white mb-2"><CountUp target={s.value} /></p>
                <p className="text-forest-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-tag mx-auto mb-4">The journey</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-navy-900 mb-4">Four steps to your front door</h2>
          <p className="text-navy-800/60 max-w-xl mx-auto">An automated pipeline that cultivates mortgage-ready candidates from the ground up.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="card-hover p-6 group">
              <div className="font-mono text-5xl font-bold text-forest-100 group-hover:text-forest-200 transition-colors mb-4 leading-none">{step.number}</div>
              <h3 className="font-display text-lg font-semibold text-navy-900 mb-2">{step.title}</h3>
              <p className="text-sm text-navy-800/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Credit triage visual ── */}
      <section className="bg-cream-100 py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-tag mx-auto mb-4">Intelligent routing</div>
            <h2 className="font-display text-4xl font-bold text-navy-900">The credit triage engine</h2>
          </div>
          <div className="card p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="card bg-cream-50 px-6 py-4 font-medium text-navy-900 text-center whitespace-nowrap">Monthly score input</div>
              <div className="text-cream-400 font-light text-2xl hidden lg:block">→</div>
              <div className="flex flex-col gap-4 flex-1 w-full">
                {[
                  { color: 'bg-red-500', label: 'Bad credit (< 580)', action: 'Routes to aggressive AI credit rehabilitation & dispute automation', badge: 'badge-red' },
                  { color: 'bg-amber-400', label: 'Low credit (580–669)', action: 'Routes to targeted AI debt-management coaching modules', badge: 'badge-yellow' },
                  { color: 'bg-forest-500', label: 'Good credit (670+)', action: 'Routes automatically to the Loan Assistance Gateway', badge: 'badge-green' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-cream-50 border border-cream-200 hover:border-forest-200 transition-colors">
                    <div className={`w-3 h-3 rounded-full ${row.color} shrink-0`} />
                    <span className="font-medium text-sm text-navy-900 w-44 shrink-0">{row.label}</span>
                    <span className="text-navy-800/60 text-sm">{row.action}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-navy-800/40 mt-8">Replaces manual file reviews with automated, color-coded status triggers</p>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-tag mx-auto mb-4">Platform features</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-navy-900">Built for real results</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card-hover p-8 group">
              <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center mb-6 group-hover:bg-forest-200 transition-colors">
                <f.icon size={22} className="text-forest-700" />
              </div>
              <h3 className="font-display text-xl font-semibold text-navy-900 mb-3">{f.title}</h3>
              <p className="text-navy-800/60 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="bg-navy-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-grain" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-forest-600/20 blur-3xl" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-forest-700/50 bg-forest-900/50 text-forest-400 text-sm font-medium mb-4">
              <Star size={14} fill="currentColor" /> Real stories
            </div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white">Their path. Their home.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 hover:bg-white/8 transition-colors">
                <p className="text-white/80 text-sm leading-relaxed mb-6 italic font-display">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-800 flex items-center justify-center text-forest-300 text-xs font-medium">{t.initials}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-forest-400 text-xs">{t.score} · {t.months}</p>
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
        <h2 className="font-display text-5xl lg:text-6xl font-bold text-navy-900 mb-6">
          Your front door<br /><span className="text-gradient italic">is waiting</span>
        </h2>
        <p className="text-navy-800/60 text-lg mb-10 max-w-xl mx-auto">Join hundreds of future homeowners who are building their path one credit point at a time.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/signup" className="btn-primary text-base px-10 py-4 shadow-glow-forest">
            Create your account <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn-secondary text-base px-10 py-4">
            Sign in instead
          </Link>
        </div>
        <p className="text-xs text-navy-800/40 mt-6">Demo credentials: <span className="font-mono">alex@demo.com</span> / <span className="font-mono">demo123</span> · Admin: <span className="font-mono">admin@pto.com</span> / <span className="font-mono">admin123</span></p>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-cream-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-forest-600 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 18 18" fill="none"><path d="M9 1.5L15.5 5.5V12.5L9 16.5L2.5 12.5V5.5L9 1.5Z" stroke="white" strokeWidth="1.5" fill="none"/><circle cx="9" cy="9" r="2.5" fill="white"/></svg>
            </div>
            <span className="text-sm font-medium text-navy-900">Path to Ownership</span>
          </div>
          <p className="text-xs text-navy-800/40">© 2025 Path to Ownership. AI Credit & Class Management Platform.</p>
        </div>
      </footer>
    </div>
  )
}
