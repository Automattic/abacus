import addToDate from 'date-fns/add'

import { getExperimentsAuthInfo, saveExperimentsAuthInfoToDefaultStorage as saveExperimentsAuthInfo } from './auth'

describe('utils/auth.ts module', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  describe('getExperimentsAuthInfo', () => {
    it('should initially return `null` but can later retrieve value set with `saveExperimentsAuthInfo`', () => {
      expect(getExperimentsAuthInfo(window.localStorage)).toBe(null)

      const expiresAt = addToDate(new Date(), { hours: 24 }).getTime()
      saveExperimentsAuthInfo({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })

      expect(getExperimentsAuthInfo(window.localStorage)).toEqual({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })
    })
    it('handles errors', () => {
      const brokenStorage: Storage = {
        setItem: jest.fn(),
        clear: jest.fn(),
        getItem: () => {
          throw new Error('broken!')
        },
        key: jest.fn(),
        length: 0,
        removeItem: jest.fn(),
      }
      const originalErrorLog = console.error
      console.error = jest.fn()

      expect(() => getExperimentsAuthInfo(brokenStorage)).not.toThrow()
      expect(console.error).toHaveBeenCalledTimes(1)
      console.error = originalErrorLog
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

      expect(getExperimentsAuthInfo(window.localStorage)).toEqual({
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
