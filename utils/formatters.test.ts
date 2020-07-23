import { formatBoolean, formatUsCurrencyDollar } from './formatters'

describe('utils/formatters.ts module', () => {
  describe('formatBoolean', () => {
    it('should format true as Yes', () => {
      expect(formatBoolean(true)).toBe('Yes')
    })

    it('should format true as No', () => {
      expect(formatBoolean(false)).toBe('No')
    })
  })

  describe('formatUsCurrencyDollar', () => {
    it('should format value in US dollars', () => {
      expect(formatUsCurrencyDollar(0.02)).toBe('$0.02')
    })
  })
})
