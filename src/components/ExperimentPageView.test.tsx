/* eslint-disable @typescript-eslint/require-await */
import { act, screen, waitFor } from '@testing-library/react'
import MockDate from 'mockdate'
import * as notistack from 'notistack'
import React from 'react'

import AnalysesApi from 'src/api/AnalysesApi'
import ExperimentsApi from 'src/api/ExperimentsApi'
import MetricsApi from 'src/api/MetricsApi'
import SegmentsApi from 'src/api/SegmentsApi'
import { Status } from 'src/lib/schemas'
import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

import ExperimentPageView, { ExperimentView } from './ExperimentPageView'

MockDate.set('2020-07-21')

jest.mock('src/api/ExperimentsApi')
const mockedExperimentsApi = ExperimentsApi as jest.Mocked<typeof ExperimentsApi>

jest.mock('src/api/MetricsApi')
const mockedMetricsApi = MetricsApi as jest.Mocked<typeof MetricsApi>

jest.mock('src/api/SegmentsApi')
const mockedSegmentsApi = SegmentsApi as jest.Mocked<typeof SegmentsApi>

jest.mock('src/api/AnalysesApi')
const mockedAnalysesApi = AnalysesApi as jest.Mocked<typeof AnalysesApi>

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

const renderExperimentPageView = async ({ experiment: experimentOverrides = {} }, view: ExperimentView) => {
  const experiment = Fixtures.createExperimentFull(experimentOverrides)
  mockedExperimentsApi.findById.mockImplementationOnce(async () => experiment)

  const metrics = Fixtures.createMetricBares(10)
  mockedMetricsApi.findAll.mockImplementationOnce(async () => metrics)

  const segments = Fixtures.createSegments(10)
  mockedSegmentsApi.findAll.mockImplementationOnce(async () => segments)

  const analyses = Fixtures.createAnalyses()
  mockedAnalysesApi.findByExperimentId.mockImplementationOnce(async () => analyses)

  const debug = view === ExperimentView.Debug

  // This `act` is needed to fix warnings:
  await act(async () => {
    render(<ExperimentPageView experimentId={experiment.experimentId} view={view} debugMode={debug} />)
  })
}

/**
 * Gets an map of button states
 * - true: visible and enabled
 * - false: visible and disabled
 * - null: not on screen
 */
const getButtonStates = () => {
  const editInWizard = screen.getByRole('link', { name: /Edit In Wizard/ })
  const run = screen.getByRole('button', { name: /Run/ })
  const disable = screen.getByRole('button', { name: /Disable/ })
  const generalPanelEdit = screen.getByRole('button', { name: /Edit Experiment General Data/ })
  const assignMetric = screen.getByRole('button', { name: /Assign Metric/ })
  const conclusionEdit = screen.queryByRole('button', { name: /Edit Conclusion/ })

  return {
    editInWizard: !editInWizard.classList.contains('Mui-disabled'),
    run: !run.hasAttribute('disabled'),
    disable: !disable.hasAttribute('disabled'),
    generalPanelEdit: !generalPanelEdit.hasAttribute('disabled'),
    assignMetric: !assignMetric.hasAttribute('disabled'),
    conclusionEdit: conclusionEdit && !conclusionEdit.hasAttribute('disabled'),
  }
}

test('experiment page view renders results without crashing', async () => {
  await renderExperimentPageView({}, ExperimentView.Results)
})

test('experiment page view renders code-setup without crashing', async () => {
  await renderExperimentPageView({}, ExperimentView.CodeSetup)
})

test('experiment pages view renders debug view', async () => {
  await renderExperimentPageView({}, ExperimentView.Debug)
})

test('renders with an unknown experiment name', async () => {
  await renderExperimentPageView(
    {
      experiment: {
        name: null,
      },
    },
    ExperimentView.Overview,
  )
})

test('experiment page view renders with null experimentId without crashing', async () => {
  const metrics = Fixtures.createMetricBares(10)
  mockedMetricsApi.findAll.mockImplementationOnce(async () => metrics)

  const segments = Fixtures.createSegments(10)
  mockedSegmentsApi.findAll.mockImplementationOnce(async () => segments)

  await act(async () => {
    render(
      <ExperimentPageView
        experimentId={(null as unknown) as number}
        view={ExperimentView.Overview}
        debugMode={false}
      />,
    )
  })
})

test('staging experiment shows correct features enabled in overview', async () => {
  await renderExperimentPageView({ experiment: { status: Status.Staging } }, ExperimentView.Overview)

  await waitFor(() => screen.getByRole('button', { name: /Assign Metric/ }))

  expect(getButtonStates()).toEqual({
    editInWizard: true,
    run: true,
    disable: true,
    generalPanelEdit: false,
    assignMetric: false,
    conclusionEdit: null,
  })
})

test('running experiment shows correct features enabled in overview', async () => {
  await renderExperimentPageView({ experiment: { status: Status.Running } }, ExperimentView.Overview)

  await waitFor(() => screen.getByRole('button', { name: /Assign Metric/ }))

  expect(getButtonStates()).toEqual({
    editInWizard: false,
    run: false,
    disable: true,
    generalPanelEdit: true,
    assignMetric: true,
    conclusionEdit: null,
  })
})

test('completed experiment shows correct features enabled in overview', async () => {
  await renderExperimentPageView({ experiment: { status: Status.Completed } }, ExperimentView.Overview)

  await waitFor(() => screen.getByRole('button', { name: /Assign Metric/ }))

  expect(getButtonStates()).toEqual({
    editInWizard: false,
    run: false,
    disable: true,
    generalPanelEdit: true,
    assignMetric: true,
    conclusionEdit: true,
  })
})

test('disabled experiment shows correct features enabled in overview', async () => {
  await renderExperimentPageView({ experiment: { status: Status.Disabled } }, ExperimentView.Overview)

  await waitFor(() => screen.getByRole('button', { name: /Assign Metric/ }))

  expect(getButtonStates()).toEqual({
    editInWizard: false,
    run: false,
    disable: false,
    generalPanelEdit: true,
    assignMetric: true,
    conclusionEdit: true,
  })
})
