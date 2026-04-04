import api from './api'

export const studentService = {
  getOverview: () => api.get('/student/overview'),
  getLearningPath: () => api.get('/student/learning-path'),
  getSnapshot: () => api.get('/student/snapshot'),
  getXpSummary: () => api.get('/student/xp-summary'),
  enrollBootcamp: ({ bootcampId, application } = {}) => api.post('/student/bootcamp', { bootcampId, application }),
  initializeBootcampPayment: (payload) => api.post('/student/bootcamp/payments/initialize', payload),
  verifyBootcampPayment: (reference) => api.get('/student/bootcamp/payments/verify', { params: { reference } }),
  getCourse: () => api.get('/student/course'),
  getCourseProgress: () => api.get('/student/course/progress'),
  getBootcampResources: (params) => api.get('/student/bootcamp/resources', { params }),
  requestQuiz: (payload) => api.post('/student/quiz', payload),
}
