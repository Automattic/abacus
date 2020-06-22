import '@/styles/main.scss'

import _ from 'lodash'
import React from 'react'

import MetricsTable from '@/components/MetricsTable'
import { MetricBare } from '@/models'

let idCounter = 0
const newId = (): number => {
  const thisId = idCounter
  idCounter = idCounter + 1
  return thisId
}

const randomMetric = (): MetricBare => {
  const id = newId()
  return {
    metricId: id,
    name: `Name: ${id}`,
    description: `The description for ${id}.`,
    parameterType: id % 2 === 0 ? 'revenue' : 'conversion',
  }
}

export default { title: 'MetricsTable' }
export const withNoMetrics = () => <MetricsTable metrics={[]} />
export const withFewMetrics = () => <MetricsTable metrics={_.range(4).map(randomMetric)} />
export const withManyMetrics = () => <MetricsTable metrics={_.range(40).map(randomMetric)} />
