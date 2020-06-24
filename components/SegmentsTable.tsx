import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import React, { useMemo } from 'react'

import { Segment, SegmentType } from '@/models'

function SegmentsTable({
  resolvedSegmentAssignments,
  type,
}: {
  resolvedSegmentAssignments: {
    segment: Segment
    isExcluded: boolean
  }[]
  type: SegmentType
}) {
  const sortedResolvedSegmentAssignments = useMemo(
    () =>
      [...resolvedSegmentAssignments].sort((a, b) => {
        return a.segment.name > b.segment.name ? 1 : -1
      }),
    [resolvedSegmentAssignments],
  )
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component='th' variant='head'>
            {type}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedResolvedSegmentAssignments.map(
          (resolvedSegmentAssignment) =>
            resolvedSegmentAssignment.segment && (
              <TableRow key={resolvedSegmentAssignment.segment.segmentId}>
                <TableCell>
                  {resolvedSegmentAssignment.segment.name}
                  {resolvedSegmentAssignment.isExcluded && <span className='pill'>Excluded</span>}
                </TableCell>
              </TableRow>
            ),
        )}
      </TableBody>
    </Table>
  )
}

export default SegmentsTable
