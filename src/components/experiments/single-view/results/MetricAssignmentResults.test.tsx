import React from 'react'
import Plot from 'react-plotly.js'

import { AnalysisStrategy } from 'src/lib/schemas'
import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

import MetricAssignmentResults from './MetricAssignmentResults'

// Unfortunately Plotly doesn't produce graphs with deterministic IDs so we have to mock it
jest.mock('react-plotly.js')
const mockedPlot = Plot as jest.MockedClass<typeof Plot>
beforeEach(() => {
  mockedPlot.mockClear()
})

const experiment = Fixtures.createExperimentFull()

test('renders an appropriate message with no analyses', () => {
  const { container } = render(
    <MetricAssignmentResults
      strategy={AnalysisStrategy.PpNaive}
      metricAssignment={Fixtures.createMetricAssignment({})}
      metric={Fixtures.createMetrics(1)[0]}
      analysesByStrategyDateAsc={{
        [AnalysisStrategy.PpNaive]: [],
        [AnalysisStrategy.MittNoSpammersNoCrossovers]: [],
        [AnalysisStrategy.MittNoSpammers]: [],
        [AnalysisStrategy.MittNoCrossovers]: [],
        [AnalysisStrategy.IttPure]: [],
      }}
      experiment={experiment}
    />,
  )
  expect(container).toMatchSnapshot()
})
