import React from 'react'

import { MetricFull } from '@/models'
import { formatUsCurrencyDollar } from '@/utils/currency'

interface Props {
  metric: MetricFull
  minDifference: number
}

/**
 * Renders the attribution window in concise, human readable text.
 */
const MetricMinimumDifference = (props: Props) => {
  const { metric, minDifference } = props
  const parameterType = metric.determineParameterType()
  return <span>{parameterType === 'revenue' ? formatUsCurrencyDollar(minDifference) : `${minDifference} pp`}</span>
}

export default MetricMinimumDifference
