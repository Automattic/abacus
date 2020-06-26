import { render } from '@testing-library/react'
import React from 'react'

import { Segment, SegmentType } from '@/models'

import SegmentsTable from './SegmentsTable'

test('renders as expected with segment names not in order', () => {
  const resolvedSegmentAssignments = [
    { segment: new Segment({ segmentId: 1, name: 'foo', type: SegmentType.Country }), isExcluded: false },
    { segment: new Segment({ segmentId: 2, name: 'bar', type: SegmentType.Country }), isExcluded: true },
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
              <div
                class="MuiChip-root makeStyles-excluded-1"
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
