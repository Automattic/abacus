import { binomialProbValue } from './math'

describe('utils/math.ts module', () => {
  describe('binomialProbValue', () => {
    it('is approximately correct', () => {
      // Testing against known values from scipy using stats.binom_test:
      const digitsPrecision = 2
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 1, totalTrials: 30, probabilityOfSuccess: 0.5 })),
      ).toBeCloseTo(0.000002, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 15, totalTrials: 30, probabilityOfSuccess: 0.5 })),
      ).toBeCloseTo(1, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 600, totalTrials: 10000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 700, totalTrials: 10000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 800, totalTrials: 10000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0.0, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 900, totalTrials: 10000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0.000759, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 950, totalTrials: 10000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0.0989, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 10000, totalTrials: 10000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 105, totalTrials: 1000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0.598, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 110, totalTrials: 1000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0.2917, digitsPrecision)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 500, totalTrials: 1000, probabilityOfSuccess: 0.1 })),
      ).toBeCloseTo(0.000002, digitsPrecision)
    })
    it('is correct for 0 trials', () => {
      expect(binomialProbValue({ successfulTrials: 0, totalTrials: 0, probabilityOfSuccess: 0.1 })).toBe(1)
    })
    it('throws an error for invalid probability of success', () => {
      expect(() =>
        binomialProbValue({ successfulTrials: 40, totalTrials: 100, probabilityOfSuccess: -1 }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid probabilityOfSuccess, expected [0,1]."`)
      expect(() =>
        binomialProbValue({ successfulTrials: 40, totalTrials: 100, probabilityOfSuccess: -2 }),
      ).toThrowErrorMatchingInlineSnapshot(`"Invalid probabilityOfSuccess, expected [0,1]."`)
    })
    it('throws an error for invalid successful trials', () => {
      expect(() =>
        binomialProbValue({ successfulTrials: 400, totalTrials: 100, probabilityOfSuccess: 0.2 }),
      ).toThrowErrorMatchingInlineSnapshot(`"Successful Trials must be less than or equal to total trials"`)
    })
  })
})
