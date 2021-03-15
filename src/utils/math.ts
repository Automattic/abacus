import binomialTest from '@stdlib/stats/binomial-test'

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
  return binomialTest(successfulTrials, totalTrials, { p: probabilityOfSuccess }).pValue
}
