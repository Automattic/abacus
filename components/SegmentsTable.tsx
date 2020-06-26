import Chip from '@material-ui/core/Chip'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import _ from 'lodash'
import React, { useMemo } from 'react'

import { Segment, SegmentType, SegmentTypeToHuman } from '@/models'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    excluded: {
      marginLeft: theme.spacing(1),
    },
  }),
)

/**
 * Renders the segments of a particular type.
 *
 * @param props.resolvedSegmentAssignments - The segment assignments with the
 *   segment IDs resolved to the actual segment.
 * @param props.type - The segment type the segment assignments represent.
 */
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
    () => _.orderBy(resolvedSegmentAssignments, [_.property('segment.name')]),
    [resolvedSegmentAssignments],
  )
  const classes = useStyles()
  const what = type === SegmentType.Country ? 'countries' : 'locales'
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell component='th' variant='head'>
            {SegmentTypeToHuman[type]}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {resolvedSegmentAssignments.length === 0 ? (
          <TableRow>
            <TableCell>All {what} included</TableCell>
          </TableRow>
        ) : (
          sortedResolvedSegmentAssignments.map(
            (resolvedSegmentAssignment) =>
              resolvedSegmentAssignment.segment && (
                <TableRow key={resolvedSegmentAssignment.segment.segmentId}>
                  <TableCell>
                    {resolvedSegmentAssignment.segment.name}
                    {resolvedSegmentAssignment.isExcluded && (
                      <Chip className={classes.excluded} label='Excluded' size='small' />
                    )}
                  </TableCell>
                </TableRow>
              ),
          )
        )}
      </TableBody>
    </Table>
  )
}

export default SegmentsTable
