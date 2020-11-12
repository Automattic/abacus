/* eslint-disable @typescript-eslint/require-await, no-irregular-whitespace */
import { act, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { noop } from 'lodash'
import * as notistack from 'notistack'
import React from 'react'

import ExperimentsApi from 'src/api/ExperimentsApi'
import { Status } from 'src/lib/schemas'
import Fixtures from 'src/test-helpers/fixtures'
import { changeFieldByRole, render } from 'src/test-helpers/test-utils'

import MetricAssignmentsPanel from './MetricAssignmentsPanel'

jest.mock('src/api/ExperimentsApi')
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
            class="MuiTypography-root makeStyles-title-3 MuiTypography-h3 MuiTypography-colorTextPrimary"
          >
            Metrics
          </h3>
          <div
            class=""
            title="Use \\"Edit in Wizard\\" for staging experiments."
          >
            <button
              class="MuiButtonBase-root MuiButton-root MuiButton-outlined Mui-disabled Mui-disabled"
              disabled=""
              tabindex="-1"
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
            </button>
          </div>
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
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                metric_1
                <br />
                <div
                  aria-disabled="true"
                  class="MuiChip-root makeStyles-primaryChip-7 MuiChip-outlined Mui-disabled"
                >
                  <span
                    class="MuiChip-label"
                  >
                    Primary
                  </span>
                </div>
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                1 week
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                Yes
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                <span>
                  0.1
                   
                  <span
                    class="makeStyles-tooltipped-8"
                    title="Percentage Points"
                  >
                    pp
                  </span>
                </span>
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                metric_2
                <br />
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                1 hour
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                Yes
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
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
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                metric_2
                <br />
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                4 weeks
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                No
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
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
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                metric_3
                <br />
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                6 hours
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                Yes
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-2"
              >
                <span>
                  12
                   
                  <span
                    class="makeStyles-tooltipped-8"
                    title="Percentage Points"
                  >
                    pp
                  </span>
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
  const experiment = Fixtures.createExperimentFull({ status: Status.Running })
  const experimentReloadRef: React.MutableRefObject<() => void> = { current: noop }
  render(<MetricAssignmentsPanel {...{ experiment, metrics, experimentReloadRef }} />)

  mockedExperimentsApi.assignMetric.mockReset()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
