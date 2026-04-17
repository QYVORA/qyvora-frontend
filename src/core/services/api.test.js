// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import api from './api'

describe('api interceptors', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.resetHistory()
    localStorage.removeItem('hs_csrf')
    document.cookie = 'csrf_token=csrf123'
  })

  it('adds CSRF header when cookie is present', async () => {
    mock.onGet('/ping').reply(200, { ok: true })
    await api.get('/ping')
    const headers = mock.history.get[0].headers || {}
    expect(headers['X-CSRF-Token']).toBe('csrf123')
  })

  it('falls back to stored CSRF token when cookie is unavailable', async () => {
    document.cookie = 'csrf_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    localStorage.setItem('hs_csrf', 'stored_csrf_token')

    mock.onPost('/auth/logout').reply(200, { success: true })
    await api.post('/auth/logout')

    const headers = mock.history.post[0].headers || {}
    expect(headers['X-CSRF-Token']).toBe('stored_csrf_token')
  })

  it('uses a single refresh call for concurrent 401s', async () => {
    mock.onPost('/auth/refresh').reply(200, { ok: true })

    let first = true
    mock.onGet('/protected').reply(() => {
      if (first) {
        first = false
        return [401, { error: 'unauthorized' }]
      }
      return [200, { ok: true }]
    })

    const [a, b] = await Promise.all([
      api.get('/protected'),
      api.get('/protected'),
    ])

    expect(a.status).toBe(200)
    expect(b.status).toBe(200)
    expect(mock.history.post.filter((r) => r.url === '/auth/refresh').length).toBe(1)
  })
})
