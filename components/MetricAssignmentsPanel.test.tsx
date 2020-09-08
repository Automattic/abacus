/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { noop } from 'lodash'
import * as notistack from 'notistack'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import Fixtures from '@/test-helpers/fixtures'
import { changeFieldByRole, render } from '@/test-helpers/test-utils'

import MetricAssignmentsPanel from './MetricAssignmentsPanel'

jest.setTimeout(10000)

jest.mock('@/api/ExperimentsApi')
const mockedExperimentsApi = ExperimentsApi as jest.Mocked<typeof ExperimentsApi>

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

test('renders as expected with all metrics resolvable', () => {
  const metrics = Fixtures.createMetricBares()
  const experiment = Fixtures.createExperimentFull()
  const experimentReloadRef: React.MutableRefObject<() => void> = { current: noop }
  const { container } = render(<MetricAssignmentsPanel {...{ experiment, metrics, experimentReloadRef }} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <div
          class="MuiToolbar-root MuiToolbar-regular MuiToolbar-gutters"
        >
          <h3
            class="MuiTypography-root makeStyles-title-2 MuiTypography-h3 MuiTypography-colorTextPrimary"
          >
            Metrics
          </h3>
          <button
            class="MuiButtonBase-root MuiButton-root MuiButton-outlined"
            tabindex="0"
            type="button"
          >
            <span
              class="MuiButton-label"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                />
              </svg>
              Assign Metric
            </span>
            <span
              class="MuiTouchRipple-root"
            />
          </button>
        </div>
        <table
          class="MuiTable-root"
        >
          <thead
            class="MuiTableHead-root"
          >
            <tr
              class="MuiTableRow-root MuiTableRow-head"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="columnheader"
                scope="col"
              >
                Name
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="columnheader"
                scope="col"
              >
                Attribution Window
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="columnheader"
                scope="col"
              >
                Changes Expected
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="columnheader"
                scope="col"
              >
                Minimum Difference
              </th>
            </tr>
          </thead>
          <tbody
            class="MuiTableBody-root"
          >
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                metric_1
                <span
                  class="makeStyles-primary-1 makeStyles-root-6"
                >
                  Primary
                </span>
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                1 week
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Yes
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span>
                  0.1 pp
                </span>
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                metric_2
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                4 weeks
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                No
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span>
                  $10.50
                </span>
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                metric_2
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                1 hour
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Yes
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span>
                  $0.50
                </span>
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                metric_3
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                6 hours
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Yes
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span>
                  12 pp
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})

test('throws an error when some metrics not resolvable', () => {
  const metrics = Fixtures.createMetricBares(1)
  const experiment = Fixtures.createExperimentFull()
  const experimentReloadRef: React.MutableRefObject<() => void> = { current: noop }

  // Note: This console.error spy is mainly used to suppress the output that the
  // `render` function outputs.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => {})
  try {
    render(<MetricAssignmentsPanel {...{ experiment, metrics, experimentReloadRef }} />)
    expect(false).toBe(true) // Should never be reached
  } catch (err) {
    expect(consoleErrorSpy).toHaveBeenCalled()
  } finally {
    consoleErrorSpy.mockRestore()
  }
})

test('opens, submits and cancels assign metric dialog', async () => {
  const metrics = Fixtures.createMetricBares(5)
  const experiment = Fixtures.createExperimentFull()
  const experimentReloadRef: React.MutableRefObject<() => void> = { current: noop }
  const { container: _container } = render(<MetricAssignmentsPanel {...{ experiment, metrics, experimentReloadRef }} />)

  mockedExperimentsApi.assignMetric.mockReset()
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  mockedExperimentsApi.assignMetric.mockImplementationOnce(async () => null)

  const startAssignButton = screen.getByRole('button', { name: /Assign Metric/ })
  fireEvent.click(startAssignButton)

  await waitFor(() => screen.getByRole('button', { name: 'Assign' }))
  const assignButton = screen.getByRole('button', { name: 'Assign' })

  // We click it now to test the validation state
  fireEvent.click(assignButton)

  const metricSearchField = screen.getByRole('button', { name: /Select a Metric/ })
  await act(async () => {
    fireEvent.focus(metricSearchField)
  })
  await act(async () => {
    fireEvent.keyDown(metricSearchField, { key: 'Enter' })
  })
  const metricOption = await screen.findByRole('option', { name: /metric_3/ })
  await act(async () => {
    fireEvent.click(metricOption)
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

  await changeFieldByRole('spinbutton', /Minimum Difference/, '0.01')

  fireEvent.click(assignButton)
  await waitForElementToBeRemoved(assignButton)

  expect(mockedExperimentsApi.assignMetric).toHaveBeenCalledTimes(1)
  expect(mockedExperimentsApi.assignMetric).toHaveBeenLastCalledWith(experiment, {
    attributionWindowSeconds: '86400',
    changeExpected: false,
    isPrimary: false,
    metricId: 3,
    minDifference: 0.01,
  })

  fireEvent.click(startAssignButton)

  await waitFor(() => screen.getByRole('button', { name: /Cancel/ }))

  const cancelButton = screen.getByRole('button', { name: /Cancel/ })
  fireEvent.click(cancelButton)
  await waitForElementToBeRemoved(cancelButton)

  expect(mockedExperimentsApi.assignMetric).toHaveBeenCalledTimes(1)
})
