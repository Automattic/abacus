import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { render } from '@/helpers/test-utils'

import AnalysisSummary from './AnalysisSummary'

const experiment = Fixtures.createExperimentFull()
const metrics = Fixtures.createMetricBares()
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
        class="MuiPaper-root MuiPaper-elevation2 MuiPaper-rounded"
        style="position: relative;"
      >
        <div
          class="Component-horizontalScrollContainer-5"
          style="overflow-x: auto; position: relative;"
        >
          <div>
            <div
              style="overflow-y: auto;"
            >
              <div>
                <table
                  class="MuiTable-root"
                  style="table-layout: auto;"
                >
                  <thead
                    class="MuiTableHead-root"
                  >
                    <tr
                      class="MuiTableRow-root MuiTableRow-head"
                    >
                      <th
                        class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                        scope="col"
                        style="font-weight: 700; box-sizing: border-box;"
                      >
                        Strategy
                      </th>
                      <th
                        class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                        scope="col"
                        style="font-weight: 700; box-sizing: border-box;"
                      >
                        Total
                      </th>
                      <th
                        class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                        scope="col"
                        style="font-weight: 700; box-sizing: border-box;"
                      >
                        control
                      </th>
                      <th
                        class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                        scope="col"
                        style="font-weight: 700; box-sizing: border-box;"
                      >
                        test
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="MuiTableBody-root"
                  >
                    <tr
                      class="MuiTableRow-root"
                      index="0"
                      level="0"
                      path="0"
                      style="transition: all ease 300ms; opacity: 0.8;"
                    >
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        All participants
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        1000
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        600
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        400
                      </td>
                    </tr>
                    <tr
                      class="MuiTableRow-root"
                      index="1"
                      level="0"
                      path="1"
                      style="transition: all ease 300ms; opacity: 0.8;"
                    >
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        Without crossovers
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        900
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        540
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        360
                      </td>
                    </tr>
                    <tr
                      class="MuiTableRow-root"
                      index="2"
                      level="0"
                      path="2"
                      style="transition: all ease 300ms; opacity: 0.8;"
                    >
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        Without spammers
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        850
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        510
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        340
                      </td>
                    </tr>
                    <tr
                      class="MuiTableRow-root"
                      index="3"
                      level="0"
                      path="3"
                      style="transition: all ease 300ms; opacity: 0.8;"
                    >
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        Without crossovers and spammers
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        800
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        480
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        320
                      </td>
                    </tr>
                    <tr
                      class="MuiTableRow-root"
                      index="4"
                      level="0"
                      path="4"
                      style="transition: all ease 300ms; opacity: 0.8;"
                    >
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        Exposed without crossovers and spammers
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        700
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        420
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        280
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
        <h6
          class="MuiTypography-root MuiTypography-subtitle1"
        >
          <strong>
            <code>
              metric_1
            </code>
          </strong>
           
          with 
          1 week
           attribution, last analyzed on 
          <span
            class="makeStyles-root-7"
            title="09/05/2020, 20:00:00"
          >
            2020-05-10
          </span>
        </h6>
        <div
          class="MuiPaper-root MuiPaper-elevation2 MuiPaper-rounded"
          style="position: relative;"
        >
          <div
            class="Component-horizontalScrollContainer-5"
            style="overflow-x: auto; position: relative;"
          >
            <div>
              <div
                style="overflow-y: auto;"
              >
                <div>
                  <table
                    class="MuiTable-root"
                    style="table-layout: auto;"
                  >
                    <thead
                      class="MuiTableHead-root"
                    >
                      <tr
                        class="MuiTableRow-root MuiTableRow-head"
                      >
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
                        >
                          Strategy
                        </th>
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
                        >
                          Participants (not final)
                        </th>
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
                        >
                          Difference interval
                        </th>
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
                        >
                          Recommendation
                        </th>
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
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
                        index="0"
                        level="0"
                        path="0"
                        style="transition: all ease 300ms; opacity: 0.8;"
                      >
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          All participants
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          1000 (100)
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          [-0.01, 0.01]
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          End experiment; deploy 
                          <code>
                            test
                          </code>
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
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
                        index="1"
                        level="0"
                        path="1"
                        style="transition: all ease 300ms; opacity: 0.8;"
                      >
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          Without crossovers
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          900 (90)
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          [-0.01, 0.01]
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          Keep running
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        />
                      </tr>
                      <tr
                        class="MuiTableRow-root"
                        index="2"
                        level="0"
                        path="2"
                        style="transition: all ease 300ms; opacity: 0.8;"
                      >
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          Without spammers
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          850 (85)
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          [-0.01, 0.01]
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          End experiment; deploy either variation
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        />
                      </tr>
                      <tr
                        class="MuiTableRow-root"
                        index="3"
                        level="0"
                        path="3"
                        style="transition: all ease 300ms; opacity: 0.8;"
                      >
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          Without crossovers and spammers
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          800 (80)
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          [-0.01, 0.01]
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          End experiment; deploy 
                          <code>
                            test
                          </code>
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
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
                        index="4"
                        level="0"
                        path="4"
                        style="transition: all ease 300ms; opacity: 0.8;"
                      >
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          Exposed without crossovers and spammers
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          700 (70)
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          [-0.01, 0.01]
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          End experiment; deploy 
                          <code>
                            test
                          </code>
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
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
            </div>
          </div>
        </div>
        <br />
      </div>
      <div>
        <h6
          class="MuiTypography-root MuiTypography-subtitle1"
        >
          <strong>
            <code>
              metric_2
            </code>
          </strong>
           
          with 
          4 weeks
           attribution, last analyzed on 
          <span
            class="makeStyles-root-7"
            title="09/05/2020, 20:00:00"
          >
            2020-05-10
          </span>
        </h6>
        <div
          class="MuiPaper-root MuiPaper-elevation2 MuiPaper-rounded"
          style="position: relative;"
        >
          <div
            class="Component-horizontalScrollContainer-5"
            style="overflow-x: auto; position: relative;"
          >
            <div>
              <div
                style="overflow-y: auto;"
              >
                <div>
                  <table
                    class="MuiTable-root"
                    style="table-layout: auto;"
                  >
                    <thead
                      class="MuiTableHead-root"
                    >
                      <tr
                        class="MuiTableRow-root MuiTableRow-head"
                      >
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
                        >
                          Strategy
                        </th>
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
                        >
                          Participants (not final)
                        </th>
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
                        >
                          Difference interval
                        </th>
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
                        >
                          Recommendation
                        </th>
                        <th
                          class="MuiTableCell-root MuiTableCell-head MTableHeader-header-6 MuiTableCell-alignLeft"
                          scope="col"
                          style="font-weight: 700; box-sizing: border-box;"
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
                        index="0"
                        level="0"
                        path="0"
                        style="transition: all ease 300ms; opacity: 0.8;"
                      >
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          All participants
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          10 (10)
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          N/A
                        </td>
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        />
                        <td
                          class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                          style="box-sizing: border-box;"
                        >
                          
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
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
        class="MuiPaper-root MuiPaper-elevation2 MuiPaper-rounded"
        style="position: relative;"
      >
        <div
          class="Component-horizontalScrollContainer-12"
          style="overflow-x: auto; position: relative;"
        >
          <div>
            <div
              style="overflow-y: auto;"
            >
              <div>
                <table
                  class="MuiTable-root"
                  style="table-layout: auto;"
                >
                  <thead
                    class="MuiTableHead-root"
                  >
                    <tr
                      class="MuiTableRow-root MuiTableRow-head"
                    >
                      <th
                        class="MuiTableCell-root MuiTableCell-head MTableHeader-header-13 MuiTableCell-alignLeft"
                        scope="col"
                        style="font-weight: 700; box-sizing: border-box;"
                      >
                        Strategy
                      </th>
                      <th
                        class="MuiTableCell-root MuiTableCell-head MTableHeader-header-13 MuiTableCell-alignLeft"
                        scope="col"
                        style="font-weight: 700; box-sizing: border-box;"
                      >
                        Total
                      </th>
                      <th
                        class="MuiTableCell-root MuiTableCell-head MTableHeader-header-13 MuiTableCell-alignLeft"
                        scope="col"
                        style="font-weight: 700; box-sizing: border-box;"
                      >
                        control
                      </th>
                      <th
                        class="MuiTableCell-root MuiTableCell-head MTableHeader-header-13 MuiTableCell-alignLeft"
                        scope="col"
                        style="font-weight: 700; box-sizing: border-box;"
                      >
                        test
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="MuiTableBody-root"
                  >
                    <tr
                      class="MuiTableRow-root"
                      index="0"
                      level="0"
                      path="0"
                      style="transition: all ease 300ms; opacity: 0.8;"
                    >
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        All participants
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        10
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        10
                      </td>
                      <td
                        class="MuiTableCell-root MuiTableCell-body MuiTableCell-alignLeft"
                        style="box-sizing: border-box;"
                      >
                        0
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
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
