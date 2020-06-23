import React from 'react'

import MetricsTable from '@/components/MetricsTable'

import Fixtures from '../helpers/fixtures'

export default { title: 'MetricsTable' }
export const withNoMetrics = () => <MetricsTable metrics={[]} />
export const withFewMetrics = () => <MetricsTable metrics={Fixtures.createMetricBares(4)} />
export const withManyMetrics = () => <MetricsTable metrics={Fixtures.createMetricBares(40)} />
