import api from './api'

export const profileService = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  updateAvatar: (data) => api.put('/profile/avatar', data),
  changePassword: (data) => api.put('/profile/password', data),
  getRecoveryToken: () => api.get('/profile/recovery-token'),
  acknowledgeRecoveryToken: () => api.post('/profile/recovery-token/ack'),
  regenerateRecoveryToken: () => api.post('/profile/recovery-token/regenerate'),
}
