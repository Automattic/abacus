import React from 'react'

import { Segment, SegmentType } from 'src/lib/schemas'
import { render } from 'src/test-helpers/test-utils'

import SegmentsTable from './SegmentsTable'

test('renders as expected with segment names not in order', () => {
  const resolvedSegmentAssignments: Array<{ segment: Segment; isExcluded: boolean }> = [
    { segment: { segmentId: 1, name: 'foo', type: SegmentType.Country }, isExcluded: false },
    { segment: { segmentId: 2, name: 'bar', type: SegmentType.Country }, isExcluded: true },
  ]
  const { container } = render(
    <SegmentsTable resolvedSegmentAssignments={resolvedSegmentAssignments} type={SegmentType.Country} />,
  )

  expect(container).toMatchInlineSnapshot(`
    <div>
      <table
        class="MuiTable-root makeStyles-root-1"
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
              Countries
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
              class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-3"
            >
              bar
               
              <div
                aria-disabled="true"
                class="MuiChip-root MuiChip-outlined Mui-disabled"
              >
                <span
                  class="MuiChip-label"
                >
                  Excluded
                </span>
              </div>
            </td>
          </tr>
          <tr
            class="MuiTableRow-root"
          >
            <td
              class="MuiTableCell-root MuiTableCell-body makeStyles-monospace-3"
            >
              foo
               
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `)
})
