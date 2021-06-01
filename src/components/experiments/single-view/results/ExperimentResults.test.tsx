import { fireEvent, getAllByText, getByText, screen, waitFor } from '@testing-library/react'
import React from 'react'
import Plot from 'react-plotly.js'

import ExperimentResults from 'src/components/experiments/single-view/results/ExperimentResults'
import { AnalysisStrategy, MetricParameterType } from 'src/lib/schemas'
import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

// Unfortunately Plotly doesn't produce graphs with deterministic IDs so we have to mock it
jest.mock('react-plotly.js')
const mockedPlot = Plot as jest.MockedClass<typeof Plot>
beforeEach(() => {
  mockedPlot.mockClear()
})

const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricBares()
const analyses = Fixtures.createAnalyses()

test('renders an appropriate message with no analyses', () => {
  const { container } = render(<ExperimentResults analyses={[]} experiment={experiment} metrics={metrics} />)
  expect(container).toMatchSnapshot()
})

test('renders correctly for 1 analysis datapoint', async () => {
  const { container } = render(
    <ExperimentResults
      analyses={[
        Fixtures.createAnalysis({ analysisStrategy: AnalysisStrategy.PpNaive }),
        Fixtures.createAnalysis({ analysisStrategy: AnalysisStrategy.IttPure }),
        Fixtures.createAnalysis({ analysisStrategy: AnalysisStrategy.MittNoCrossovers }),
        Fixtures.createAnalysis({ analysisStrategy: AnalysisStrategy.MittNoSpammers }),
        Fixtures.createAnalysis({ analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers }),
      ]}
      experiment={experiment}
      metrics={metrics}
    />,
  )

  // Check the table snapshot before expanding any metric.
  expect(container.querySelector('.analysis-latest-results')).toMatchSnapshot()

  // Clicking on metric_1 or metric_2 should have no effect on anything, but metric_3 should render the details.
  fireEvent.click(getByText(container, /metric_1/))
  fireEvent.click(getAllByText(container, /metric_2/)[0])
  fireEvent.click(getByText(container, /metric_3/))
  await waitFor(() => getByText(container, /Last analyzed/), { container })
  expect(container.querySelector('.analysis-latest-results .analysis-detail-panel')).toMatchSnapshot()

  expect(mockedPlot).toMatchSnapshot()
})

test('renders the condensed table with some analyses in non-debug mode for a Conversion Metric', async () => {
  const { container } = render(<ExperimentResults analyses={analyses} experiment={experiment} metrics={metrics} />)

  // In non-debug mode, we shouldn't have a <pre> element with the JSON.
  expect(container.querySelector('.debug-json')).toBeNull()

  // Check the table snapshot before expanding any metric.
  expect(container.querySelector('.analysis-latest-results')).toMatchSnapshot()

  // Clicking on metric_1 or metric_2 should have no effect on anything, but metric_3 should render the details.
  fireEvent.click(getByText(container, /metric_1/))
  fireEvent.click(getAllByText(container, /metric_2/)[0])
  fireEvent.click(getByText(container, /metric_3/))
  await waitFor(() => getAllByText(container, /Last analyzed/), { container })
  expect(container.querySelector('.analysis-latest-results .analysis-detail-panel')).toMatchSnapshot()

  expect(mockedPlot).toMatchSnapshot()
})

test('renders the condensed table with some analyses in non-debug mode for a Revenue Metric', async () => {
  const metrics = Fixtures.createMetricBares().map((metric) => ({
    ...metric,
    parameterType: MetricParameterType.Revenue,
  }))

  const { container } = render(<ExperimentResults analyses={analyses} experiment={experiment} metrics={metrics} />)

  // In non-debug mode, we shouldn't have a <pre> element with the JSON.
  expect(container.querySelector('.debug-json')).toBeNull()

  // Check the table snapshot before expanding any metric.
  expect(container.querySelector('.analysis-latest-results')).toMatchSnapshot()

  // Clicking on metric_1 or metric_2 should have no effect on anything, but metric_3 should render the details.
  fireEvent.click(getByText(container, /metric_1/))
  fireEvent.click(getAllByText(container, /metric_2/)[0])
  fireEvent.click(getByText(container, /metric_3/))
  await waitFor(() => getAllByText(container, /Last analyzed/), { container })
  expect(container.querySelector('.analysis-latest-results .analysis-detail-panel')).toMatchSnapshot()

  expect(mockedPlot).toMatchSnapshot()
})

test('allows you to change analysis strategy', async () => {
  const { container } = render(
    <ExperimentResults analyses={[]} experiment={{ ...experiment, exposureEvents: undefined }} metrics={metrics} />,
  )

  fireEvent.click(screen.getByRole('button', { name: /Choose an Analysis Strategy/ }))
  const analysisStrategy = screen.getByRole('button', { name: /Analysis Strategy:/ })
  fireEvent.focus(analysisStrategy)
  fireEvent.keyDown(analysisStrategy, { key: 'Enter' })
  const analysisStrategyOption = await screen.findByRole('option', { name: /All participants/ })
  fireEvent.click(analysisStrategyOption)

  expect(container).toMatchSnapshot()
})
