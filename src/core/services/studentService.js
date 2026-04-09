import api from './api'

export const studentService = {
  getOverview: () => api.get('/student/overview'),
  getLearningPath: () => api.get('/student/learning-path'),
  getSnapshot: () => api.get('/student/snapshot'),
  getXpSummary: () => api.get('/student/xp-summary'),
  getOnboarding: () => api.get('/student/onboarding'),
  updateOnboarding: (payload) => api.post('/student/onboarding', payload),
  enrollBootcamp: ({ bootcampId, application } = {}) => api.post('/student/bootcamp', { bootcampId, application }),
  initializeBootcampPayment: (payload) => api.post('/student/bootcamp/payments/initialize', payload),
  verifyBootcampPayment: (reference) => api.get('/student/bootcamp/payments/verify', { params: { reference } }),
  claimLandingReward: (key) => api.post('/student/rewards/claim', { key }),
  getCourse: (params) => api.get('/student/course', { params }),
  getCourseProgress: (params) => api.get('/student/course/progress', { params }),
  getBootcampResources: (params) => api.get('/student/bootcamp/resources', { params }),
  requestQuiz: (payload) => api.post('/student/quiz', payload),
  getRooms: () => api.get('/student/rooms'),
  getRoom: (slug) => api.get(`/student/rooms/${slug}`),
  completeRoom: (roomId) => api.post(`/student/rooms/${roomId}/complete`),
}
