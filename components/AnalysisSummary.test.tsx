import { render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'

import AnalysisSummary from './AnalysisSummary'

const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricsBares()
const analyses = Fixtures.createAnalyses()

test('renders an appropriate message with no analyses', () => {
  const { container } = render(<AnalysisSummary analyses={[]} experiment={experiment} metrics={metrics} />)
  expect(container).toHaveTextContent('No analyses yet for experiment_1.')
})

test('renders the full tables with some analyses', () => {
  const { container } = render(<AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} />)

  expect(container).toHaveTextContent(`Found ${analyses.length} analysis objects in total.`)
  // In non-debug mode, we shouldn't have a <pre> element with the JSON.
  expect(container.querySelector('pre')).toBeNull()

  // Table snapshots are somewhat verbose, but they will allow us to see if there are any expected changes to the
  // numbers in the tables.
  expect(container.querySelector('.analysis-participant-counts')).toMatchInlineSnapshot(`
    <div
      class="analysis-participant-counts"
    >
      <h3>
        Participant counts for the primary metric
      </h3>
      <div
        class="MuiPaper-root MuiTableContainer-root MuiPaper-elevation1 MuiPaper-rounded"
      >
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
                scope="col"
              >
                Strategy
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                scope="col"
              >
                Total
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                scope="col"
              >
                <code>
                  control
                </code>
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                scope="col"
              >
                <code>
                  test
                </code>
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
                All participants
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                1000
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                600
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                400
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Without crossovers
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                900
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                540
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                360
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Without spammers
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                850
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                510
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                340
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Without crossovers and spammers
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                800
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                480
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                320
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Exposed without crossovers and spammers
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                700
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                420
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                280
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)

  expect(container.querySelector('.analysis-latest-results')).toMatchInlineSnapshot(`
    <div
      class="analysis-latest-results"
    >
      <h3>
        Latest results by metric
      </h3>
      <div>
        <div>
          <strong>
            Metric: 
          </strong>
          <code>
            metric_1
          </code>
        </div>
        <div>
          <strong>
            Attribution window: 
          </strong>
          1 week
        </div>
        <div>
          <strong>
            Last analyzed: 
          </strong>
          <span
            class="datetime-text"
            title="09/05/2020, 20:00:00"
          >
            2020-05-10
          </span>
        </div>
        <div
          class="MuiPaper-root MuiTableContainer-root MuiPaper-elevation1 MuiPaper-rounded"
        >
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
                  scope="col"
                >
                  Strategy
                </th>
                <th
                  class="MuiTableCell-root MuiTableCell-head"
                  scope="col"
                >
                  Participants (not final)
                </th>
                <th
                  class="MuiTableCell-root MuiTableCell-head"
                  scope="col"
                >
                  Difference interval
                </th>
                <th
                  class="MuiTableCell-root MuiTableCell-head"
                  scope="col"
                >
                  Recommendation
                </th>
                <th
                  class="MuiTableCell-root MuiTableCell-head"
                  scope="col"
                >
                  Warnings
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
                  All participants
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  1000
                   (
                  100
                  )
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  [
                  -0.01
                  , 
                  0.01
                  ]
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  End experiment; deploy 
                  <code>
                    test
                  </code>
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  <div>
                    Experiment period is too short. Wait a few days to be safer.
                  </div>
                  <div>
                    The CI is too wide in comparison to the ROPE. Collect more data to be safer.
                  </div>
                </td>
              </tr>
              <tr
                class="MuiTableRow-root"
              >
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  Without crossovers
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  900
                   (
                  90
                  )
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  [
                  -0.01
                  , 
                  0.01
                  ]
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  Keep running
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                />
              </tr>
              <tr
                class="MuiTableRow-root"
              >
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  Without spammers
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  850
                   (
                  85
                  )
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  [
                  -0.01
                  , 
                  0.01
                  ]
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  End experiment; deploy either variation
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                />
              </tr>
              <tr
                class="MuiTableRow-root"
              >
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  Without crossovers and spammers
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  800
                   (
                  80
                  )
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  [
                  -0.01
                  , 
                  0.01
                  ]
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  End experiment; deploy 
                  <code>
                    test
                  </code>
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  <div>
                    Experiment period is too short. Wait a few days to be safer.
                  </div>
                  <div>
                    The CI is too wide in comparison to the ROPE. Collect more data to be safer.
                  </div>
                </td>
              </tr>
              <tr
                class="MuiTableRow-root"
              >
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  Exposed without crossovers and spammers
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  700
                   (
                  70
                  )
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  [
                  -0.01
                  , 
                  0.01
                  ]
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  End experiment; deploy 
                  <code>
                    test
                  </code>
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  <div>
                    Experiment period is too short. Wait a few days to be safer.
                  </div>
                  <div>
                    The CI is too wide in comparison to the ROPE. Collect more data to be safer.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <div>
          <strong>
            Metric: 
          </strong>
          <code>
            metric_2
          </code>
        </div>
        <div>
          <strong>
            Attribution window: 
          </strong>
          4 weeks
        </div>
        <div>
          <strong>
            Last analyzed: 
          </strong>
          <span
            class="datetime-text"
            title="09/05/2020, 20:00:00"
          >
            2020-05-10
          </span>
        </div>
        <div
          class="MuiPaper-root MuiTableContainer-root MuiPaper-elevation1 MuiPaper-rounded"
        >
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
                  scope="col"
                >
                  Strategy
                </th>
                <th
                  class="MuiTableCell-root MuiTableCell-head"
                  scope="col"
                >
                  Participants (not final)
                </th>
                <th
                  class="MuiTableCell-root MuiTableCell-head"
                  scope="col"
                >
                  Difference interval
                </th>
                <th
                  class="MuiTableCell-root MuiTableCell-head"
                  scope="col"
                >
                  Recommendation
                </th>
                <th
                  class="MuiTableCell-root MuiTableCell-head"
                  scope="col"
                >
                  Warnings
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
                  All participants
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  10
                   (
                  10
                  )
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  N/A
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  N/A
                </td>
                <td
                  class="MuiTableCell-root MuiTableCell-body"
                >
                  Not analyzed yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `)
})

test('renders the full tables with some analyses and a different primary metric', () => {
  const diffPrimaryExperiment = Fixtures.createExperimentFull({
    metricAssignments: [
      Fixtures.createMetricAssignment({ ...experiment.metricAssignments[0], isPrimary: false }),
      Fixtures.createMetricAssignment({ ...experiment.metricAssignments[1], isPrimary: true }),
    ],
  })
  const { container } = render(
    <AnalysisSummary analyses={analyses} experiment={diffPrimaryExperiment} metrics={metrics} />,
  )
  expect(container).toHaveTextContent(`Found ${analyses.length} analysis objects in total.`)

  // Only looking at the participant counts for this test: They should match the primary metric.
  expect(container.querySelector('.analysis-participant-counts')).toMatchInlineSnapshot(`
    <div
      class="analysis-participant-counts"
    >
      <h3>
        Participant counts for the primary metric
      </h3>
      <div
        class="MuiPaper-root MuiTableContainer-root MuiPaper-elevation1 MuiPaper-rounded"
      >
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
                scope="col"
              >
                Strategy
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                scope="col"
              >
                Total
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                scope="col"
              >
                <code>
                  control
                </code>
              </th>
              <th
                class="MuiTableCell-root MuiTableCell-head"
                scope="col"
              >
                <code>
                  test
                </code>
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
                All participants
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                10
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                10
              </td>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                0
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})

test('shows the analyses JSON in debug mode', () => {
  const { container } = render(
    <AnalysisSummary analyses={analyses} experiment={experiment} metrics={metrics} debugMode={true} />,
  )
  expect(container.querySelector('pre.debug-json')).toMatchSnapshot()
})
