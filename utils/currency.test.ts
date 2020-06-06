import { formatUsCurrencyDollar } from './currency'

describe('utils/currency.ts module', () => {
  describe('formatUsCurrencyDollar', () => {
    it('should format value in US dollars', () => {
      expect(formatUsCurrencyDollar(0.02)).toBe('$0.02')
    })
  })
})
