import api from './api'

export const adminService = {
  getOverview: () => api.get('/admin/overview'),
  getUsers: () => api.get('/admin/users'),
  getRecoveryToken: (id) => api.post(`/admin/users/${id}/recovery-token`),
  updateUser: (id, data) => api.patch(`/admin/users/${id}`, data),
  getContent: () => api.get('/admin/content'),
  updateContent: (data) => api.patch('/admin/content', data),
  uploadFreeResource: (formData) => api.post('/admin/uploads/free-resources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadBootcampImage: (formData) => api.post('/admin/uploads/bootcamp-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  uploadCPProduct: (formData) => api.post('/admin/uploads/cp-products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getCPProducts: () => api.get('/admin/cp-products'),
  createCPProduct: (data) => api.post('/admin/cp-products', data),
  updateCPProduct: (id, data) => api.patch(`/admin/cp-products/${id}`, data),
  deleteCPProduct: (id) => api.delete(`/admin/cp-products/${id}`),
  getSecurityEvents: (params) => api.get('/admin/security/events', { params }),
}
