import api from './api'

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (payload) => api.post('/auth/register', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  requestPasswordReset: (email) => api.post('/auth/password-reset/request', { email }),
  confirmPasswordReset: (token, password) => api.post('/auth/password-reset/confirm', { token, password }),
}
