import api from './api'

export const notificationsService = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.post(`/notifications/${id}/read`, {}),
  markAllRead: () => api.post('/notifications/read-all', {}),
}
