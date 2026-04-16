import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Simulated DB in localStorage
const USERS_KEY = 'pto_users'
const SESSION_KEY = 'pto_session'

const seedUsers = () => {
  const existing = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  if (existing.length > 0) return

  const demo = [
    { id: 'u1', name: 'Alex Johnson',    email: 'alex@demo.com',    password: 'demo123', role: 'participant', joined: '2025-01-15',
      creditHistory: [
        { month: '2025-01', score: 498, note: 'Starting point' },
        { month: '2025-02', score: 521, note: 'Paid down credit card' },
        { month: '2025-03', score: 549, note: 'Disputed old collection' },
        { month: '2025-04', score: 605, note: 'Collection removed' },
      ],
      attendance: { total: 8, attended: 6 }
    },
    { id: 'u2', name: 'Maria Rodriguez', email: 'maria@demo.com',  password: 'demo123', role: 'participant', joined: '2025-02-03',
      creditHistory: [
        { month: '2025-02', score: 612, note: 'Initial' },
        { month: '2025-03', score: 631, note: 'On-time payments' },
        { month: '2025-04', score: 648, note: 'Lowered utilization' },
      ],
      attendance: { total: 6, attended: 6 }
    },
    { id: 'u3', name: 'Chris Lee',        email: 'chris@demo.com',   password: 'demo123', role: 'participant', joined: '2024-12-10',
      creditHistory: [
        { month: '2024-12', score: 462, note: 'Initial assessment' },
        { month: '2025-01', score: 481, note: 'Small improvement' },
        { month: '2025-02', score: 498, note: 'Dispute filed' },
        { month: '2025-03', score: 521, note: 'Progress' },
        { month: '2025-04', score: 498, note: 'Missed payment' },
      ],
      attendance: { total: 10, attended: 7 }
    },
    { id: 'u4', name: 'Sarah Kim',        email: 'sarah@demo.com',   password: 'demo123', role: 'participant', joined: '2025-03-01',
      creditHistory: [
        { month: '2025-03', score: 698, note: 'Good standing' },
        { month: '2025-04', score: 712, note: 'Excellent progress' },
      ],
      attendance: { total: 4, attended: 4 }
    },
    { id: 'u5', name: 'David Chen',       email: 'david@demo.com',   password: 'demo123', role: 'participant', joined: '2025-01-20',
      creditHistory: [
        { month: '2025-01', score: 580, note: 'Initial' },
        { month: '2025-02', score: 595, note: 'Improving' },
        { month: '2025-03', score: 605, note: 'Steady' },
        { month: '2025-04', score: 618, note: 'Reduced debt' },
      ],
      attendance: { total: 7, attended: 5 }
    },
    { id: 'admin1', name: 'Admin User', email: 'admin@pto.com', password: 'admin123', role: 'admin', joined: '2024-01-01',
      creditHistory: [], attendance: { total: 0, attended: 0 }
    },
  ]
  localStorage.setItem(USERS_KEY, JSON.stringify(demo))
}

export function getStatusFromScore(score) {
  if (score >= 670) return { label: 'Good',     color: 'green',  description: 'Loan assistance unlocked!' }
  if (score >= 580) return { label: 'Low',      color: 'yellow', description: 'Keep improving — almost there.' }
  return                   { label: 'Critical', color: 'red',    description: 'Intensive coaching activated.' }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    seedUsers()
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
      const found = users.find(u => u.id === session)
      if (found) setUser(found)
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) throw new Error('Invalid email or password.')
    localStorage.setItem(SESSION_KEY, found.id)
    setUser(found)
    return found
  }

  const signup = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (users.find(u => u.email === email)) throw new Error('Email already registered.')
    const newUser = {
      id: 'u' + Date.now(), name, email, password, role: 'participant',
      joined: new Date().toISOString().split('T')[0],
      creditHistory: [],
      attendance: { total: 0, attended: 0 }
    }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    localStorage.setItem(SESSION_KEY, newUser.id)
    setUser(newUser)
    return newUser
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const addCreditEntry = (score, note = '') => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return
    const month = new Date().toISOString().slice(0, 7)
    const existing = users[idx].creditHistory.findIndex(h => h.month === month)
    const entry = { month, score, note }
    if (existing >= 0) users[idx].creditHistory[existing] = entry
    else users[idx].creditHistory.push(entry)
    users[idx].creditHistory.sort((a, b) => a.month.localeCompare(b.month))
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    setUser({ ...users[idx] })
  }

  const getAllUsers = () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    return users.filter(u => u.role === 'participant')
  }

  const refreshUser = () => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const found = users.find(u => u.id === user.id)
    if (found) setUser(found)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, addCreditEntry, getAllUsers, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
