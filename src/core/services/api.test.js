// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import MockAdapter from 'axios-mock-adapter'
import api from './api'

describe('api interceptors', () => {
  let mock

  beforeEach(() => {
    mock = new MockAdapter(api)
    mock.resetHistory()
    document.cookie = 'csrf_token=csrf123'
  })

  it('adds CSRF header when cookie is present', async () => {
    mock.onGet('/ping').reply(200, { ok: true })
    await api.get('/ping')
    const headers = mock.history.get[0].headers || {}
    expect(headers['X-CSRF-Token']).toBe('csrf123')
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
