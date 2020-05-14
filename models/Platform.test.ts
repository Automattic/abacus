import { Platform, toPlatform } from './Platform'

describe('models/Platform.ts module', () => {
  describe('toPlatform', () => {
    it('called with valid input should resolve to expected `Platform` enum', () => {
      expect(toPlatform('calypso')).toBe(Platform.Calypso)
      expect(toPlatform('wpcom')).toBe(Platform.Wpcom)
    })

    it('called with invalid input should resolve to `Platform.Calypso`', () => {
      expect(toPlatform('Calypso')).toBe(Platform.Calypso)
      expect(toPlatform('')).toBe(Platform.Calypso)
      expect(toPlatform('wrong')).toBe(Platform.Calypso)
    })
  })
})
