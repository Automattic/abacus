import addToDate from 'date-fns/add'

import { getExperimentsAuthInfo, saveExperimentsAuthInfo } from './auth'

describe('utils/auth.ts module', () => {
  afterEach(() => {
    window.localStorage.clear()
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
