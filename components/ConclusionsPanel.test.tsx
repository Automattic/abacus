import { render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'

import ConclusionsPanel from './ConclusionsPanel'

test('renders as expected', () => {
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
                Description for ending experiment
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
