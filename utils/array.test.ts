import { hasDuplicateStrings } from './array'

describe('utils/array.ts module', () => {
  describe('hasDuplicateStrings', () => {
    it('called with empty array should return false', () => {
      expect(hasDuplicateStrings([])).toBe(false)
    })

    it('called with array with one string should return false', () => {
      expect(hasDuplicateStrings([''])).toBe(false)
      expect(hasDuplicateStrings(['foo'])).toBe(false)
    })

    it('called with array with unique strings should return false', () => {
      expect(hasDuplicateStrings(['', 'foo'])).toBe(false)
      expect(hasDuplicateStrings(['foo', 'bar'])).toBe(false)
      expect(hasDuplicateStrings(['foo', 'bar', 'quux'])).toBe(false)
    })

    it('called with array with duplicate strings should return true', () => {
      expect(hasDuplicateStrings(['', ''])).toBe(true)
      expect(hasDuplicateStrings(['foo', 'foo'])).toBe(true)
      expect(hasDuplicateStrings(['foo', 'bar', 'foo'])).toBe(true)
    })
  })
})
