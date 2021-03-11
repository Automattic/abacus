import { abs, erf } from 'mathjs'

/**
 * Assuming a distribution of X ~ Binomial(n, p), returns the probability of the number of trials being equal to x or more extreme than x.
 *
 * @param successfulTrials number of successful trials
 * @param totalTrials number of total trials
 * @param probabilityOfSuccess probability of success
 */
export function binomialProbValue( { successfulTrials, totalTrials, probabilityOfSuccess} : { successfulTrials: number, totalTrials: number, probabilityOfSuccess: number}): number {
  const mean = totalTrials * probabilityOfSuccess
  const variance = totalTrials * probabilityOfSuccess * (1 - probabilityOfSuccess)
  // By the CLT, B ~ Binomial(n, p) is approximated well enough by X ~ N(mu, sigma)) for n > 30
  // We don't care about the accuracy for n <= 30 so we let them be.
  // And if Y ~ N(0, 1/2) then Y = (X - mu)/(2 * sigma)^(1/2)
  const y = abs(successfulTrials - mean) / Math.sqrt(2 * variance)
  // Since erf gives the probabilty of [-y, y] on Y, and pValue is the union of [-inf, -y] and [y, inf]:
  return 1 - erf(y)
}
