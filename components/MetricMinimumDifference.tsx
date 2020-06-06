import React from 'react'

import { MetricFull } from '@/models'

interface Props {
  metric: MetricFull
  minDifference: number
}

/**
 * Renders the attribution window in concise, human readable text.
 */
const MetricMinimumDifference = (props: Props) => {
  // TODO: Ask how to present the minimum difference. In the mockup, I see some
  // formatted as US currency and others with a `pp` unit.
  return <span>{props.minDifference}</span>
}

export default MetricMinimumDifference
