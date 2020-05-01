import { getAuthClientId, getExperimentsApiAuth, saveExperimentsApiAuth } from './auth'

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

  describe('getExperimentsApiAuth', () => {
    it('should initially return `null` but can later retrieve value set with `saveExperimentsApiAuth`', () => {
      expect(getExperimentsApiAuth()).toBe(null)

      const expiresAt = Date.now() + 24 * 60 * 60 * 1000
      saveExperimentsApiAuth({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })

      expect(getExperimentsApiAuth()).toEqual({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })
    })
  })

  describe('saveExperimentsApiAuth', () => {
    it('called with null should remove localStorage item', () => {
      expect(localStorage.getItem('abacus_auth_info')).toBe(null)

      const expiresAt = Date.now() + 24 * 60 * 60 * 1000
      saveExperimentsApiAuth({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })

      expect(getExperimentsApiAuth()).toEqual({
        accessToken: 'abunchofcharactersthatlookrandom',
        expiresAt,
        scope: 'global',
        type: 'token',
      })

      saveExperimentsApiAuth(null)

      expect(localStorage.getItem('abacus_auth_info')).toBe(null)
    })
  })
})
