import api from './api'

export const studentService = {
  getOverview: () => api.get('/student/overview'),
  getLearningPath: () => api.get('/student/learning-path'),
  getSnapshot: () => api.get('/student/snapshot'),
  getXpSummary: () => api.get('/student/xp-summary'),
}

