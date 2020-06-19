import '@/styles/main.scss'

import _ from 'lodash'
import React from 'react'

import { MetricBare } from '@/models'

import MetricsTable from './MetricsTable'

export default { title: 'MetricsTable' }

const metrics: MetricBare[] = []

export const withNoMetrics = () => <MetricsTable metrics={metrics} />

const METRIC_TEMPLATE = {
  description: 'The description.',
  parameterType: 'revenue' as 'revenue',
}

let idCounter = 0
const newId = (): number => {
  const thisId = idCounter
  idCounter = idCounter + 1
  return thisId
}

const randomMetric = (): MetricBare => {
  const id = newId()
  return {
    ...METRIC_TEMPLATE,
    // ts-ignore: don't know what is wrong with this fella
    metricId: id,
    name: `Name: ${id}`,
  } as MetricBare
}

const onePageOfMetrics: MetricBare[] = _.range(4).map(randomMetric)

export const withOnePageOfMetrics = () => <MetricsTable metrics={onePageOfMetrics} />

const moreThanOnePageOfMetrics: MetricBare[] = _.range(40).map(randomMetric)

export const withMoreThanOnePageOfMetrics = () => <MetricsTable metrics={moreThanOnePageOfMetrics} />
