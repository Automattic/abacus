import React from 'react'

import { MetricFull } from '@/models'
import { formatUsCurrencyDollar } from '@/utils/currency'

/**
 * Renders the attribution window in concise, human readable text.
 */
const MetricMinimumDifference = (props: { metric: MetricFull; minDifference: number }) => {
  const { metric, minDifference } = props
  const parameterType = metric.determineParameterType()
  return <span>{parameterType === 'revenue' ? formatUsCurrencyDollar(minDifference) : `${minDifference} pp`}</span>
}

export default MetricMinimumDifference
