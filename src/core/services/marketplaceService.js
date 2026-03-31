import api from './api'

export const marketplaceService = {
  getItems: (params) => api.get('/public/cp-products', { params }),
}

