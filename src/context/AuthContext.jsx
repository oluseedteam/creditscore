import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

// Axios API configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api', // Respects Netlify/Vercel URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Attach token to requests if exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getStatusFromScore(score) {
  if (score >= 670) return { label: 'Good',     color: 'green',  description: 'Loan assistance unlocked!' }
  if (score >= 580) return { label: 'Low',      color: 'yellow', description: 'Keep improving — almost there.' }
  return                   { label: 'Critical', color: 'red',    description: 'Intensive coaching activated.' }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const formatUserData = (u) => {
    if (!u) return null
    return {
      ...u,
      creditHistory: u.credit_history || u.creditHistory || [],
      attendance: u.attendance || { attended: 0, total: 0 }
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const res = await api.get('/me')
          setUser(formatUserData(res.data.user))
        } catch {
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [])

  const login = async (email, password) => {
    try {
      const res = await api.post('/login', { email, password })
      localStorage.setItem('token', res.data.token)
      const u = formatUserData(res.data.user)
      setUser(u)
      return u
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Invalid credentials')
    }
  }

  const signup = async (name, email, password) => {
    try {
      const res = await api.post('/register', { name, email, password })
      localStorage.setItem('token', res.data.token)
      const u = formatUserData(res.data.user)
      setUser(u)
      return u
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed'
      throw new Error(msg)
    }
  }

  const logout = async () => {
    try {
      await api.post('/logout')
    } catch { console.error('Logout error') }
    localStorage.removeItem('token')
    setUser(null)
  }

  const addCreditEntry = async (score, note = '') => {
    try {
      const month = new Date().toISOString().slice(0, 7)
      await api.post('/credit-scores', { month, score, note })
      await refreshUser()
    } catch {
      console.error('Failed to add credit score')
    }
  }

  const updateCreditEntry = async (id, score, note = '') => {
    try {
      await api.put(`/credit-scores/${id}`, { score, note })
      await refreshUser()
    } catch {
      console.error('Failed to update credit score')
    }
  }

  const deleteCreditEntry = async (id) => {
    try {
      await api.delete(`/credit-scores/${id}`)
      await refreshUser()
    } catch {
      console.error('Failed to delete credit score')
    }
  }

  const getAllUsers = async () => {
    try {
      const res = await api.get('/users')
      return res.data.map(formatUserData)
    } catch {
      return []
    }
  }

  const refreshUser = async () => {
    try {
      const res = await api.get('/me')
      setUser(formatUserData(res.data.user))
    } catch {
      console.error('Failed to refresh')
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, addCreditEntry, updateCreditEntry, deleteCreditEntry, getAllUsers, refreshUser, api }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
