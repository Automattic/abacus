import { render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'

import ExperimentDetails from './ExperimentDetails'

test('renders as expected', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<ExperimentDetails experiment={experiment} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div>
        <h2>
          Experiment details
        </h2>
        <table>
          <tbody>
            <tr>
              <td>
                Name
              </td>
              <td>
                experiment_1
              </td>
            </tr>
            <tr>
              <td>
                P2 Link
              </td>
              <td>
                <a
                  href="https://wordpress.com/experiment_1"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  P2
                </a>
              </td>
            </tr>
            <tr>
              <td>
                Description
              </td>
              <td>
                Experiment with things. Change stuff. Profit.
              </td>
            </tr>
            <tr>
              <td>
                Start
              </td>
              <td>
                2020-06-04T00:00:00.000+00:00
              </td>
            </tr>
            <tr>
              <td>
                End
              </td>
              <td>
                2020-07-04T00:00:00.000+00:00
              </td>
            </tr>
            <tr>
              <td>
                Status
              </td>
              <td>
                completed
              </td>
            </tr>
            <tr>
              <td>
                Platform
              </td>
              <td>
                calypso
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})
