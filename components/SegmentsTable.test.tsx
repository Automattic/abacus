import React from 'react'

import { render } from '@/helpers/test-utils'
import { Segment, SegmentType } from '@/lib/schemas'

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
              class="MuiTableCell-root MuiTableCell-body"
            >
              bar
              <span
                class="makeStyles-excluded-1 makeStyles-root-2"
              >
                Excluded
              </span>
            </td>
          </tr>
          <tr
            class="MuiTableRow-root"
          >
            <td
              class="MuiTableCell-root MuiTableCell-body"
            >
              foo
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `)
})
