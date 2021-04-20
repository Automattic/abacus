import { abs, erf } from 'mathjs'

/**
 * Assuming a distribution of X ~ Binomial(n, p), returns the probability of the number of trials being equal to x or more extreme than x.
 *
 * @param successfulTrials number of successful trials
 * @param totalTrials number of total trials
 * @param probabilityOfSuccess probability of success
 */
export function binomialProbValue({
  successfulTrials,
  totalTrials,
  probabilityOfSuccess,
}: {
  successfulTrials: number
  totalTrials: number
  probabilityOfSuccess: number
}): number {
  const mean = totalTrials * probabilityOfSuccess
  const variance = totalTrials * probabilityOfSuccess * (1 - probabilityOfSuccess)
  // By the CLT, B ~ Binomial(n, p) is approximated well enough by X ~ N(mean, variance) for n > 30
  // See also: https://en.wikipedia.org/wiki/Central_limit_theorem
  //           https://en.wikipedia.org/wiki/Binomial_distribution#Normal_approximation
  // (We don't care about the accuracy for n <= 30 so we let them be.)
  // And if Y ~ N(0, 1/2) then Y = (X - mean)/(2 * variance)^(1/2)
  // See also: https://en.wikipedia.org/wiki/Normal_distribution#Symmetries_and_derivatives
  const y = (successfulTrials - mean) / Math.sqrt(2 * variance)
  // Since erf(abs(y)) gives the probabilty of [-y, y] on Y, and pValue is the union of [-inf, -y] and [y, inf]:
  // See also: https://en.wikipedia.org/wiki/Error_function
  return 1 - erf(abs(y))
}
