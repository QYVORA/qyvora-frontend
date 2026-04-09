import api from './api'

export const adminService = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  getContent: () => api.get('/admin/content'),
  updateContent: (data) => api.patch('/admin/content', data),
  releaseQuiz: (data) => api.post('/admin/bootcamp/quizzes/release', data),
  getBootcampQuizSummary: (bootcampId) => api.get('/admin/bootcamp/quiz-summary', { params: { bootcampId } }),
  uploadFreeResource: (formData) => api.post('/admin/uploads/free-resources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadBootcampImage: (formData) => api.post('/admin/uploads/bootcamp-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadCPProductCover: (formData) => api.post('/admin/uploads/cp-product-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadRoomImage: (formData) => api.post('/admin/uploads/room-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadCPProduct: (formData) => api.post('/admin/uploads/cp-products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getRooms: () => api.get('/admin/rooms'),
  createRoom: (data) => api.post('/admin/rooms', data),
  updateRoom: (id, data) => api.patch(`/admin/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/admin/rooms/${id}`),
  getLearnRules: () => api.get('/admin/learn-rules'),
  createLearnRule: (data) => api.post('/admin/learn-rules', data),
  updateLearnRule: (id, data) => api.patch(`/admin/learn-rules/${id}`, data),
  deleteLearnRule: (id) => api.delete(`/admin/learn-rules/${id}`),
  getCPProducts: () => api.get('/admin/cp-products'),
  createCPProduct: (data) => api.post('/admin/cp-products', data),
  updateCPProduct: (id, data) => api.patch(`/admin/cp-products/${id}`, data),
  deleteCPProduct: (id) => api.delete(`/admin/cp-products/${id}`),
  getSecurityEvents: (params) => api.get('/admin/security/events', { params }),
}
