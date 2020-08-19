import React from 'react'

import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import MetricAssignmentsPanel from './MetricAssignmentsPanel'
import { indexMetrics } from '@/lib/normalizers'

test('renders as expected with all metrics resolvable', () => {
  const indexedMetrics = indexMetrics(Fixtures.createMetricBares())
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<MetricAssignmentsPanel metricAssignments={experiment.metricAssignments} indexedMetrics={indexedMetrics} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <h3
          class="MuiTypography-root makeStyles-title-2 MuiTypography-h3 MuiTypography-colorTextPrimary"
        >
          Metrics
        </h3>
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
                  class="makeStyles-primary-1 makeStyles-root-3"
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
  const indexedMetrics = indexMetrics(Fixtures.createMetricBares(1))
  const experiment = Fixtures.createExperimentFull()

  // Note: This console.error spy is mainly used to suppress the output that the
  // `render` function outputs.
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(() => { })
  try {
    render(<MetricAssignmentsPanel metricAssignments={experiment.metricAssignments} indexedMetrics={indexedMetrics} />)
    expect(false).toBe(true) // Should never be reached
  } catch (err) {
    expect(consoleErrorSpy).toHaveBeenCalled()
  } finally {
    consoleErrorSpy.mockRestore()
  }
})
