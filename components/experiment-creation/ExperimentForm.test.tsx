/* eslint-disable @typescript-eslint/require-await */

import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import _ from 'lodash'
import noop from 'lodash/noop'
import MockDate from 'mockdate'
import * as notistack from 'notistack'
import React from 'react'

import { experimentToFormData } from '@/lib/form-data'
import * as Normalizers from '@/lib/normalizers'
import { experimentFullNewSchema, Status } from '@/lib/schemas'
import Fixtures from '@/test-helpers/fixtures'
import { changeFieldByRole, render, validationErrorDisplayer } from '@/test-helpers/test-utils'
import { formatIsoDate } from '@/utils/time'

import ExperimentForm from './ExperimentForm'

jest.setTimeout(40000)

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

// As jest doesn't include scrollIntoView
window.HTMLElement.prototype.scrollIntoView = noop

// Needed for testing the MuiCombobox
document.createRange = () => ({
  setStart: () => undefined,
  setEnd: () => undefined,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore; This is just for mocking
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
})

// TODO: Make this more accessible
function isSectionError(sectionButton: HTMLElement) {
  return !!sectionButton.querySelector('.Mui-error')
}

function isSectionComplete(sectionButton: HTMLElement) {
  return !!sectionButton.querySelector('.MuiStepIcon-completed')
}

test('renders as expected', () => {
  MockDate.set('2020-08-13')

  const onSubmit = async () => undefined

  const { container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({})}
      onSubmit={onSubmit}
    />,
  )
  expect(container).toMatchSnapshot()
})

test('sections should be browsable by the next and prev buttons', async () => {
  MockDate.set('2020-08-13')

  const onSubmit = async () => undefined

  render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({})}
      onSubmit={onSubmit}
    />,
  )

  screen.getByText(/Design and Document Your Experiment/)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Begin/ }))
  })
  screen.getAllByText(/Basic Info/)
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Previous/ }))
  })
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

test('sections should be browsable by enter presses', async () => {
  MockDate.set('2020-08-13')

  const enterKeyCode = 13

  const onSubmit = async () => undefined

  render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({})}
      onSubmit={onSubmit}
    />,
  )

  const form = document.querySelector('form')

  if (!form) {
    throw new Error('Could not find form!')
  }

  screen.getByText(/Design and Document Your Experiment/)
  await act(async () => {
    fireEvent.keyPress(form, { key: 'Enter', code: enterKeyCode, charCode: enterKeyCode })
  })
  screen.getAllByText(/Basic Info/)
  await act(async () => {
    fireEvent.keyPress(form, { key: 'Enter', code: enterKeyCode, charCode: enterKeyCode })
  })
  screen.getByText(/Define Your Audience/)
  await act(async () => {
    fireEvent.keyPress(form, { key: 'Enter', code: enterKeyCode, charCode: enterKeyCode })
  })
  screen.getByText(/Assign Metrics/)
  await act(async () => {
    fireEvent.keyPress(form, { key: 'Enter', code: enterKeyCode, charCode: enterKeyCode })
  })
  screen.getByText(/Confirm and Submit Your Experiment/)
  await act(async () => {
    fireEvent.keyPress(form, { key: 'Enter', code: enterKeyCode, charCode: enterKeyCode })
  })
  screen.getByText(/Confirm and Submit Your Experiment/)
})

test('sections should be browsable by the section buttons', async () => {
  MockDate.set('2020-08-13')

  const onSubmit = async () => undefined

  const { container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({})}
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
  MockDate.set('2020-08-13')

  const onSubmit = async () => undefined

  render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({})}
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
  MockDate.set('2020-08-13')

  const onSubmit = async () => undefined

  const { container } = render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({})}
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

test('form submits with valid fields', async () => {
  MockDate.set('2020-08-13')

  let submittedData: unknown = null
  const onSubmit = async (formData: unknown): Promise<undefined> => {
    // We need to add a timeout here so the loading indicator renders
    await new Promise((resolve) => setTimeout(resolve, 200))
    submittedData = formData
    return
  }

  render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({})}
      onSubmit={onSubmit}
    />,
  )

  // ### Start
  screen.getByText(/Design and Document Your Experiment/)
  await changeFieldByRole('textbox', /Your Post's URL/, 'http://example.com/')
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Begin/ }))
  })

  // ### Basic Info
  screen.getAllByText(/Basic Info/)
  await changeFieldByRole('textbox', /Experiment name/, 'test_experiment_name')
  await changeFieldByRole('textbox', /Experiment description/, 'experiment description')
  // We need to make some dates relative to today since mocking the schema to work with MockDate is a pain!
  const now = new Date()
  now.setDate(now.getDate() + 1)
  const nextWeek = new Date()
  nextWeek.setDate(now.getDate() + 7)
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Start date/), { target: { value: formatIsoDate(now) } })
  })
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/End date/), { target: { value: formatIsoDate(nextWeek) } })
  })
  await changeFieldByRole('textbox', /Owner/, 'owner-nickname')
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })

  // ### Audience
  screen.getByText(/Define Your Audience/)
  const targetingField = screen.getByRole('textbox', { name: /Targeting/ })
  fireEvent.change(targetingField, { target: { value: 'segment_3' } })
  const targetingOption = await screen.findByRole('option', { name: /Locale: segment_3/ })
  await act(async () => {
    fireEvent.click(targetingOption)
  })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })

  // ### Metrics
  screen.getByText(/Assign Metrics/)
  const metricSearchField = screen.getByRole('button', { name: /Select a Metric/ })
  const metricAddButton = screen.getByRole('button', { name: 'Add metric' })
  await act(async () => {
    fireEvent.focus(metricSearchField)
  })
  await act(async () => {
    fireEvent.keyDown(metricSearchField, { key: 'Enter' })
  })
  const metricOption = await screen.findByRole('option', { name: /metric_10/ })
  await act(async () => {
    fireEvent.click(metricOption)
  })
  await act(async () => {
    fireEvent.click(metricAddButton)
  })

  const attributionWindowField = await screen.findByLabelText(/Attribution Window/)
  await act(async () => {
    fireEvent.focus(attributionWindowField)
  })
  await act(async () => {
    fireEvent.keyDown(attributionWindowField, { key: 'Enter' })
  })
  const attributionWindowFieldOption = await screen.findByRole('option', { name: /24 hours/ })
  await act(async () => {
    fireEvent.click(attributionWindowFieldOption)
  })

  await changeFieldByRole('spinbutton', /Min difference/, '0.01')

  // #### Exposure Events
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Add exposure event/ }))
  })
  await act(async () => {
    fireEvent.click(await screen.findByRole('button', { name: /Add Property/ }))
  })
  await act(async () => {
    fireEvent.click(await screen.findByRole('button', { name: /Remove exposure event property/ }))
  })
  await act(async () => {
    fireEvent.click(await screen.findByRole('button', { name: /Remove exposure event/ }))
  })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Add exposure event/ }))
  })
  await act(async () => {
    fireEvent.click(await screen.findByRole('button', { name: /Add Property/ }))
  })
  await changeFieldByRole('textbox', /Event Name/, 'event_name')
  await changeFieldByRole('textbox', /Property Key/, 'key')
  await changeFieldByRole('textbox', /Property Value/, 'value')

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })

  // ### Submit
  screen.getByText(/Confirm and Submit Your Experiment/)
  await act(async () => {
    screen.getAllByRole('button', { name: /Submit/ })
    const submit = screen
      .getAllByRole('button', { name: /Submit/ })
      .find((submit) => submit.getAttribute('type') === 'submit')
    if (!submit) {
      throw new Error(`Can't find submit button.`)
    }
    fireEvent.click(submit)
  })

  await waitFor(() => expect(submittedData).not.toBeNull())

  expect(submittedData).toEqual({
    experiment: {
      p2Url: 'http://example.com/',
      name: 'test_experiment_name',
      description: 'experiment description',
      startDatetime: formatIsoDate(now),
      endDatetime: formatIsoDate(nextWeek),
      ownerLogin: 'owner-nickname',
      platform: 'wpcom',
      existingUsersAllowed: 'true',
      exposureEvents: [
        {
          event: 'event_name',
          props: [
            {
              key: 'key',
              value: 'value',
            },
          ],
        },
      ],
      segmentAssignments: [
        {
          isExcluded: false,
          segmentId: 3,
        },
      ],
      variations: [
        {
          allocatedPercentage: 50,
          isDefault: true,
          name: 'control',
        },
        {
          allocatedPercentage: 50,
          isDefault: false,
          name: 'treatment',
        },
      ],
      metricAssignments: [
        {
          attributionWindowSeconds: '86400',
          changeExpected: false,
          isPrimary: true,
          metricId: 10,
          minDifference: 0.01,
        },
      ],
    },
  })
})

test('form submits an edited experiment without any changes', async () => {
  MockDate.set('2020-08-13')

  const experiment = Fixtures.createExperimentFull({
    status: Status.Staging,
    conclusionUrl: undefined,
    deployedVariationId: undefined,
    endReason: undefined,
  })

  let submittedData: unknown = null
  const onSubmit = async (formData: unknown): Promise<undefined> => {
    // We need to add a timeout here so the loading indicator renders
    await new Promise((resolve) => setTimeout(resolve, 200))
    submittedData = formData
    return
  }

  render(
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData(experiment)}
      onSubmit={onSubmit}
    />,
  )

  // ### Move through the form stages
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Begin/ }))
  })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }))
  })

  // ### Submit
  screen.getByText(/Confirm and Submit Your Experiment/)

  const submit = screen
    .getAllByRole('button', { name: /Submit/ })
    .find((submit) => submit.getAttribute('type') === 'submit')
  if (!submit) {
    throw new Error(`Can't find submit button.`)
  }
  fireEvent.click(submit)

  await waitFor(() => expect(submittedData).not.toBeNull())

  const validatedExperiment = await validationErrorDisplayer(
    experimentFullNewSchema.validate((submittedData as { experiment: unknown }).experiment),
  )

  // We need to remove Ids, status, conclusion data, reformat exposure events to make it like new
  const newShapedExperiment = _.clone(experiment)
  delete newShapedExperiment.experimentId
  delete newShapedExperiment.status
  delete newShapedExperiment.conclusionUrl
  delete newShapedExperiment.deployedVariationId
  delete newShapedExperiment.endReason
  newShapedExperiment.metricAssignments.forEach((metricAssignment) => delete metricAssignment.metricAssignmentId)
  newShapedExperiment.segmentAssignments.forEach((segmentAssignment) => delete segmentAssignment.segmentAssignmentId)
  newShapedExperiment.variations.forEach((variation) => delete variation.variationId)
  newShapedExperiment.exposureEvents?.forEach((exposureEvent) => {
    if (exposureEvent.props) {
      exposureEvent.props = _.toPairs(exposureEvent.props).map(([key, value]) => ({ key, value }))
    }
  })

  expect(validatedExperiment).toEqual(newShapedExperiment)
})
