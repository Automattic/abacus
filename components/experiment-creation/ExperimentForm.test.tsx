/* eslint-disable @typescript-eslint/require-await */

import { act, fireEvent, screen } from '@testing-library/react'
import noop from 'lodash/noop'
import MockDate from 'mockdate'
import * as notistack from 'notistack'
import React from 'react'

import { createInitialExperiment } from '@/lib/experiments'
import * as Normalizers from '@/lib/normalizers'
import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import ExperimentForm from './ExperimentForm'

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

// As jest doesn't include scrollIntoView
window.HTMLElement.prototype.scrollIntoView = noop

// TODO: Make this more accessible
function isSectionError(sectionButton: HTMLElement) {
  return !!sectionButton.querySelector('.Mui-error')
}

function isSectionComplete(sectionButton: HTMLElement) {
  return !!sectionButton.querySelector('.MuiStepIcon-completed')
}

test('renders as expected', () => {
  MockDate.set('2020-07-21')

  const onSubmit = async () => undefined

  const { container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={createInitialExperiment()}
      onSubmit={onSubmit}
    />,
  )
  expect(container).toMatchSnapshot()
})

test('sections should be browsable by the next buttons', async () => {
  MockDate.set('2020-07-21')

  const onSubmit = async () => undefined

  const { container: _container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={createInitialExperiment()}
      onSubmit={onSubmit}
    />,
  )

  screen.getByText(/Design and Document Your Experiment/)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Begin/ }))
  })
  screen.getAllByText(/Basic Info/)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })
  screen.getByText(/Define Your Audience/)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })
  screen.getByText(/Assign Metrics/)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })
  screen.getByText(/Confirm and Submit Your Experiment/)
})

test('sections should be browsable by the section buttons', async () => {
  MockDate.set('2020-07-21')

  const onSubmit = async () => undefined

  const { container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={createInitialExperiment()}
      onSubmit={onSubmit}
    />,
  )

  const _startSectionButton = screen.getByRole('button', { name: /Start/ })
  const basicInfoSectionButton = screen.getByRole('button', { name: /Basic Info/ })
  const _audienceSectionButton = screen.getByRole('button', { name: /Audience/ })
  const metricsSectionButton = screen.getByRole('button', { name: /Metrics/ })
  const submitSectionButton = screen.getByRole('button', { name: /Submit/ })

  screen.getByText(/Design and Document Your Experiment/)
  expect(container).toMatchSnapshot()

  await act(async () => {
    fireEvent.click(basicInfoSectionButton)
  })

  screen.getAllByText(/Basic Info/)
  expect(container).toMatchSnapshot()

  await act(async () => {
    fireEvent.click(submitSectionButton)
  })

  screen.getByText(/Confirm and Submit Your Experiment/)
  expect(container).toMatchSnapshot()

  await act(async () => {
    fireEvent.click(metricsSectionButton)
  })

  screen.getByText(/Assign Metrics/)
  expect(container).toMatchSnapshot()
})

test('section should be validated after change', async () => {
  MockDate.set('2020-07-21')

  const onSubmit = async () => undefined

  const { container: _container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={createInitialExperiment()}
      onSubmit={onSubmit}
    />,
  )

  const startSectionButton = screen.getByRole('button', { name: /Start/ })
  const basicInfoSectionButton = screen.getByRole('button', { name: /Basic Info/ })
  const audienceSectionButton = screen.getByRole('button', { name: /Audience/ })
  const metricsSectionButton = screen.getByRole('button', { name: /Metrics/ })
  const submitSectionButton = screen.getByRole('button', { name: /Submit/ })

  expect(isSectionError(startSectionButton)).toBe(false)
  expect(isSectionError(basicInfoSectionButton)).toBe(false)
  expect(isSectionError(audienceSectionButton)).toBe(false)
  expect(isSectionError(metricsSectionButton)).toBe(false)
  expect(isSectionError(submitSectionButton)).toBe(false)

  expect(isSectionComplete(startSectionButton)).toBe(false)
  expect(isSectionComplete(basicInfoSectionButton)).toBe(false)
  expect(isSectionComplete(audienceSectionButton)).toBe(false)
  expect(isSectionComplete(metricsSectionButton)).toBe(false)
  expect(isSectionComplete(submitSectionButton)).toBe(false)

  await act(async () => {
    fireEvent.click(basicInfoSectionButton)
  })

  screen.getByRole('textbox', { name: /Experiment name/ })

  expect(isSectionError(startSectionButton)).toBe(true)
  expect(isSectionError(basicInfoSectionButton)).toBe(false)
  expect(isSectionError(audienceSectionButton)).toBe(false)
  expect(isSectionError(metricsSectionButton)).toBe(false)
  expect(isSectionError(submitSectionButton)).toBe(false)

  expect(isSectionComplete(startSectionButton)).toBe(false)
  expect(isSectionComplete(basicInfoSectionButton)).toBe(false)
  expect(isSectionComplete(audienceSectionButton)).toBe(false)
  expect(isSectionComplete(metricsSectionButton)).toBe(false)
  expect(isSectionComplete(submitSectionButton)).toBe(false)

  await act(async () => {
    fireEvent.click(startSectionButton)
  })

  const postUrlInput = screen.getByRole('textbox', { name: /Your Post's URL/ })

  await act(async () => {
    fireEvent.change(postUrlInput, { target: { value: 'http://example.com/' } })
  })

  await act(async () => {
    fireEvent.click(basicInfoSectionButton)
  })

  expect(isSectionError(startSectionButton)).toBe(false)
  expect(isSectionError(basicInfoSectionButton)).toBe(false)
  expect(isSectionError(audienceSectionButton)).toBe(false)
  expect(isSectionError(metricsSectionButton)).toBe(false)
  expect(isSectionError(submitSectionButton)).toBe(false)

  expect(isSectionComplete(startSectionButton)).toBe(true)
  expect(isSectionComplete(basicInfoSectionButton)).toBe(false)
  expect(isSectionComplete(audienceSectionButton)).toBe(false)
  expect(isSectionComplete(metricsSectionButton)).toBe(false)
  expect(isSectionComplete(submitSectionButton)).toBe(false)
})

test('skipping to submit should check all sections', async () => {
  MockDate.set('2020-07-21')

  const onSubmit = async () => undefined

  const { container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={createInitialExperiment()}
      onSubmit={onSubmit}
    />,
  )

  const startSectionButton = screen.getByRole('button', { name: /Start/ })
  const basicInfoSectionButton = screen.getByRole('button', { name: /Basic Info/ })
  const audienceSectionButton = screen.getByRole('button', { name: /Audience/ })
  const metricsSectionButton = screen.getByRole('button', { name: /Metrics/ })
  const submitSectionButton = screen.getByRole('button', { name: /Submit/ })

  await act(async () => {
    fireEvent.click(submitSectionButton)
  })

  expect(container).toMatchSnapshot()

  expect(isSectionError(startSectionButton)).toBe(true)
  expect(isSectionError(basicInfoSectionButton)).toBe(true)
  expect(isSectionError(audienceSectionButton)).toBe(false)
  expect(isSectionError(metricsSectionButton)).toBe(true)
  expect(isSectionError(submitSectionButton)).toBe(false)

  expect(isSectionComplete(startSectionButton)).toBe(false)
  expect(isSectionComplete(basicInfoSectionButton)).toBe(false)
  expect(isSectionComplete(audienceSectionButton)).toBe(true)
  expect(isSectionComplete(metricsSectionButton)).toBe(false)
  expect(isSectionComplete(submitSectionButton)).toBe(false)
})

test.todo('form works as expected')
