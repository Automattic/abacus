import React from 'react'

import { MetricBare } from '@/models'
import { formatUsCurrencyDollar } from '@/utils/formatters'

/**
 * Renders the attribution window in concise, human readable text.
 */
const MetricMinimumDifference = (props: { metric: MetricBare; minDifference: number }) => {
  const { metric, minDifference } = props
  return (
    <span>{metric.parameterType === 'revenue' ? formatUsCurrencyDollar(minDifference) : `${minDifference} pp`}</span>
  )
}

export default MetricMinimumDifference
