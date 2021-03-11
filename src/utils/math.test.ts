import { binomialProbValue } from './math'

describe('utils/math.ts module', () => {
  describe('binomialProbValue', () => {
    it('is approximately correct', () => {
      const aSmallValue = 0.000005
      // Testing against known values
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 1, totalTrials: 30, probabilityOfSuccess: 0.5 }) - 0.000002),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 15, totalTrials: 30, probabilityOfSuccess: 0.5 }) - 1),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 100, totalTrials: 1000, probabilityOfSuccess: 0.1 }) - 1),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 500, totalTrials: 1000, probabilityOfSuccess: 0.1 }) - 0.000002),
      ).toBeLessThan(aSmallValue)
    })
  })
})
