import { binomialProbValue } from './math'

describe('utils/math.ts module', () => {
  describe('binomialProbValue', () => {
    it('is approximately correct', () => {
      const aSmallValue = 0.000005
      // Testing against known values from R:
      // binom.test(1, 30, p=0.5, alternative="two.sided")
      // binom.test(15, 30, p=0.5, alternative="two.sided")
      // binom.test(60, 1000, p=0.1, alternative="two.sided")
      // binom.test(70, 1000, p=0.1, alternative="two.sided")
      // binom.test(80, 1000, p=0.1, alternative="two.sided")
      // binom.test(90, 1000, p=0.1, alternative="two.sided")
      // binom.test(95, 1000, p=0.1, alternative="two.sided")
      // binom.test(100, 1000, p=0.1, alternative="two.sided")
      // binom.test(105, 1000, p=0.1, alternative="two.sided")
      // binom.test(110, 1000, p=0.1, alternative="two.sided")
      // binom.test(120, 1000, p=0.1, alternative="two.sided")
      // binom.test(500, 1000, p=0.1, alternative="two.sided")
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 1, totalTrials: 30, probabilityOfSuccess: 0.5 }) - 0.000002),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 15, totalTrials: 30, probabilityOfSuccess: 0.5 }) - 1),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(
          binomialProbValue({ successfulTrials: 60, totalTrials: 1000, probabilityOfSuccess: 0.000008 }) - 0.000002,
        ),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(
          binomialProbValue({ successfulTrials: 70, totalTrials: 1000, probabilityOfSuccess: 0.001069 }) - 0.000002,
        ),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(
          binomialProbValue({ successfulTrials: 80, totalTrials: 1000, probabilityOfSuccess: 0.03487 }) - 0.000002,
        ),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(
          binomialProbValue({ successfulTrials: 90, totalTrials: 1000, probabilityOfSuccess: 0.3165 }) - 0.000002,
        ),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(
          binomialProbValue({ successfulTrials: 95, totalTrials: 1000, probabilityOfSuccess: 0.6353 }) - 0.000002,
        ),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 100, totalTrials: 1000, probabilityOfSuccess: 0.1 }) - 1),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(
          binomialProbValue({ successfulTrials: 105, totalTrials: 1000, probabilityOfSuccess: 0.598 }) - 0.000002,
        ),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(
          binomialProbValue({ successfulTrials: 110, totalTrials: 1000, probabilityOfSuccess: 0.2917 }) - 0.000002,
        ),
      ).toBeLessThan(aSmallValue)
      expect(
        Math.abs(binomialProbValue({ successfulTrials: 500, totalTrials: 1000, probabilityOfSuccess: 0.1 }) - 0.000002),
      ).toBeLessThan(aSmallValue)
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
