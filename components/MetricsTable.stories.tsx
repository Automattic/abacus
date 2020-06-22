import '@/styles/main.scss'

import _ from 'lodash'
import React from 'react'

import { MetricBare } from '@/models'

import MetricsTable from './MetricsTable'

export default { title: 'MetricsTable' }

const metrics: MetricBare[] = []

export const withNoMetrics = () => <MetricsTable metrics={metrics} />

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
    description: 'The description for ${id}.',
    parameterType: id % 2 === 0 ? 'revenue' : 'conversion',
  } as MetricBare
}

const onePageOfMetrics: MetricBare[] = _.range(4).map(randomMetric)

export const withOnePageOfMetrics = () => <MetricsTable metrics={onePageOfMetrics} />

const moreThanOnePageOfMetrics: MetricBare[] = _.range(40).map(randomMetric)

export const withMoreThanOnePageOfMetrics = () => <MetricsTable metrics={moreThanOnePageOfMetrics} />
