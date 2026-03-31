import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hs_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('hs_token')
      localStorage.removeItem('hs_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
