import MockDate from 'mockdate'
import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { render } from '@/helpers/test-utils'

import GeneralPanel from './GeneralPanel'

MockDate.set('2020-07-21')

test('renders as expected', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<GeneralPanel experiment={experiment} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <h3
          class="MuiTypography-root makeStyles-title-2 MuiTypography-h3 MuiTypography-colorTextPrimary"
        >
          General
        </h3>
        <table
          class="MuiTable-root"
        >
          <tbody
            class="MuiTableBody-root"
          >
            <tr
              class="MuiTableRow-root"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="cell"
                scope="row"
              >
                Description
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Experiment with things. Change stuff. Profit.
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="cell"
                scope="row"
              >
                P2 Link
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <a
                  href="https://wordpress.com/experiment_1"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://wordpress.com/experiment_1
                </a>
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="cell"
                scope="row"
              >
                Dates
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span
                  class="makeStyles-root-3"
                  title="20/09/2020, 20:00:00"
                >
                  2020-09-21
                </span>
                <span
                  class="makeStyles-to-1"
                >
                  to
                </span>
                <span
                  class="makeStyles-root-3"
                  title="20/11/2020, 20:00:00"
                >
                  2020-11-21
                </span>
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="cell"
                scope="row"
              >
                Owner
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                test_a11n
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})
