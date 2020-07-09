import { or } from './general'

describe('utils/general.ts module', () => {
  describe('or', () => {
    it('should work as expected', () => {
      expect(or(true)).toBe(true)
      expect(or(false)).toBe(false)
      expect(or(true, false)).toBe(true)
      expect(or(false, true)).toBe(true)
      expect(or(true, true)).toBe(true)
      expect(or(false, false)).toBe(false)
    })
  })
})
