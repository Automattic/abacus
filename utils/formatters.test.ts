import { formatBoolean, formatIsoUtcOffset, formatUsCurrencyDollar } from './formatters'

describe('utils/formatters.ts module', () => {
  describe('formatBoolean', () => {
    it('should format true as Yes', () => {
      expect(formatBoolean(true)).toBe('Yes')
    })

    it('should format true as No', () => {
      expect(formatBoolean(false)).toBe('No')
    })
  })

  describe('formatIsoUtcOffset', () => {
    it('should format date in ISO-8601, UTC, with an offset', () => {
      expect(formatIsoUtcOffset(new Date(Date.UTC(2020, 5, 24, 13)))).toBe('2020-06-24T13:00:00.000+00:00')
    })
  })

  describe('formatUsCurrencyDollar', () => {
    it('should format value in US dollars', () => {
      expect(formatUsCurrencyDollar(0.02)).toBe('$0.02')
    })
  })
})
