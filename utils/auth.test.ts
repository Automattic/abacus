import addToDate from 'date-fns/add'

import { getAuthClientId, getExperimentsAuthInfo, saveExperimentsAuthInfo } from './auth'

describe('utils/auth.ts module', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  describe('getAuthClientId', () => {
    it('should return 68795 for host experiments.a8c.com but 68797 for all other host', () => {
      expect(getAuthClientId('experiments.a8c.com')).toBe(68795)
      expect(getAuthClientId('http://a8c-abacus-local:3000')).toBe(68797)
      expect(getAuthClientId('https://a8c-abacus-local:3000')).toBe(68797)
      expect(getAuthClientId('http://localhost')).toBe(68797)
      expect(getAuthClientId('http://localhost:3000')).toBe(68797)
      expect(getAuthClientId('https://localhost')).toBe(68797)
    })
  })

  describe('getExperimentsAuthInfo', () => {
    it('should initially return `null` but can later retrieve value set with `saveExperimentsAuthInfo`', () => {
      expect(getExperimentsAuthInfo()).toBe(null)

      const expiresAt = addToDate(new Date(), { hours: 24 }).getTime()
      saveExperimentsAuthInfo({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })

      expect(getExperimentsAuthInfo()).toEqual({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })
    })
  })

  describe('saveExperimentsAuthInfo', () => {
    it('called with null should remove localStorage item', () => {
      expect(localStorage.getItem('experiments_auth_info')).toBe(null)

      const expiresAt = addToDate(new Date(), { hours: 24 }).getTime()
      saveExperimentsAuthInfo({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })

      expect(getExperimentsAuthInfo()).toEqual({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })

      saveExperimentsAuthInfo(null)

      expect(localStorage.getItem('experiments_auth_info')).toBe(null)
    })
  })
})
