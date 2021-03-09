import { binomialProbValue } from './math'

describe('utils/math.ts module', () => {
  describe('binomialProbValue', () => {
    it('is approximately correct', () => {
      const aSmallValue = 0.000005
      // Testing against known values
      expect(Math.abs(binomialProbValue(1, 30, 0.5) - 0.000002)).toBeLessThan(aSmallValue)
      expect(Math.abs(binomialProbValue(15, 30, 0.5) - 1)).toBeLessThan(aSmallValue)
      expect(Math.abs(binomialProbValue(100, 1000, 0.1) - 1)).toBeLessThan(aSmallValue)
      expect(Math.abs(binomialProbValue(500, 1000, 0.1) - 0.000002)).toBeLessThan(aSmallValue)
    })
  })
})
