import React from 'react'

import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import ConclusionsPanel from './ConclusionsPanel'

test('renders as expected with complete conclusion data', () => {
  const experiment = Fixtures.createExperimentFull({
    conclusionUrl: 'https://betterexperiments.wordpress.com/experiment_1/conclusion',
    deployedVariationId: 2,
    endReason: 'Ran its course.',
  })
  const { container } = render(<ConclusionsPanel experiment={experiment} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <h3
          class="MuiTypography-root makeStyles-title-1 MuiTypography-h3 MuiTypography-colorTextPrimary"
        >
          Conclusions
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
                Reason the experiment ended
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Ran its course.
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
                Conclusion URL
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <a
                  href="https://betterexperiments.wordpress.com/experiment_1/conclusion"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://betterexperiments.wordpress.com/experiment_1/conclusion
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
                Deployed variation
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                test
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})

test('renders as expected without deployed variation', () => {
  const experiment = Fixtures.createExperimentFull({
    conclusionUrl: 'https://betterexperiments.wordpress.com/experiment_1/conclusion',
    deployedVariationId: null,
    endReason: 'Ran its course.',
  })
  const { container } = render(<ConclusionsPanel experiment={experiment} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <h3
          class="MuiTypography-root makeStyles-title-2 MuiTypography-h3 MuiTypography-colorTextPrimary"
        >
          Conclusions
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
                Reason the experiment ended
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Ran its course.
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
                Conclusion URL
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <a
                  href="https://betterexperiments.wordpress.com/experiment_1/conclusion"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://betterexperiments.wordpress.com/experiment_1/conclusion
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
                Deployed variation
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})
