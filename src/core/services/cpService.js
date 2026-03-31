import api from './api'

export const cpService = {
  getBalance: () => api.get('/cp/balance'),
  getTransactions: (limit = 20) => api.get('/cp/transactions', { params: { limit } }),
  purchase: (productId) => api.post('/cp/purchase', { productId }),
  download: (productId) => api.get(`/cp/products/${productId}/download`, { responseType: 'blob' }),
}
