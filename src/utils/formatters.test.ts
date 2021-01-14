import { formatBoolean } from './formatters'

describe('utils/formatters.ts module', () => {
  describe('formatBoolean', () => {
    it('should format true as Yes', () => {
      expect(formatBoolean(true)).toBe('Yes')
    })

    it('should format true as No', () => {
      expect(formatBoolean(false)).toBe('No')
    })
  })
})
