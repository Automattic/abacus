import { abs, erf } from 'mathjs'

/**
 * Assuming a distribution of X ~ Binomial(totalTrials, probabilityOfSuccess), returns the probability of the number of successful trials being equal to successfulTrials or more extreme than successfullTrials.
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
  if (totalTrials === 0 && successfulTrials === 0) {
    return 1
  }
  if (totalTrials < successfulTrials) {
    throw new Error('Successful Trials must be less than or equal to total trials')
  }
  if (probabilityOfSuccess < 0 || 1 < probabilityOfSuccess) {
    throw new Error('Invalid probabilityOfSuccess, expected [0,1].')
  }
  const mean = totalTrials * probabilityOfSuccess
  const variance = totalTrials * probabilityOfSuccess * (1 - probabilityOfSuccess)
  // By the CLT, B ~ Binomial(n, p) is approximated well enough by X ~ N(mean, variance) for n > 30
  // See also: https://en.wikipedia.org/wiki/Central_limit_theorem
  //           https://en.wikipedia.org/wiki/Binomial_distribution#Normal_approximation
  // (We don't care about the accuracy for n <= 30 so we let them be.)
  // From symmetry of the normal distribution, P(not -x < X < x) = P(X > x or X < -x) = 2 * P(X > x)
  // From https://en.wikipedia.org/wiki/Normal_distribution#Cumulative_distribution_function:
  // 2 * P(X > x) = 2 - 2 * CDF(x)
  //              = 2 - 2 * 0.5 * ( 1 + erf( (x - mean) / sqrt(2 * variance) ) )
  //              = 1 - erf( (x - mean) / sqrt(2 * variance) )
  const y = (successfulTrials - mean) / Math.sqrt(2 * variance)
  return 1 - erf(abs(y))
}
