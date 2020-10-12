import React from 'react'

import MetricsTable from 'src/components/MetricsTable'

import Fixtures from '../test-helpers/fixtures'

export default { title: 'MetricsTable' }
export const withNoMetrics = (): JSX.Element => <MetricsTable metrics={[]} />
export const withFewMetrics = (): JSX.Element => <MetricsTable metrics={Fixtures.createMetricBares(4)} />
export const withManyMetrics = (): JSX.Element => <MetricsTable metrics={Fixtures.createMetricBares(40)} />
