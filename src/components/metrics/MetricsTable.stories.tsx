import React from 'react'

import MetricsTable from 'src/components/metrics/MetricsTable'

import Fixtures from '../../test-helpers/fixtures'

export default { title: 'MetricsTable' }
export const withNoMetrics = (): JSX.Element => <MetricsTable metrics={[]} />
export const withFewMetrics = (): JSX.Element => <MetricsTable metrics={Fixtures.createMetrics(4)} />
export const withManyMetrics = (): JSX.Element => <MetricsTable metrics={Fixtures.createMetrics(40)} />
