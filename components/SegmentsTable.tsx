import { Chip } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import _ from 'lodash'
import React, { useMemo } from 'react'

import { Segment, SegmentType } from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& th, & td': {
        paddingLeft: 0,
      },
    },
    excluded: {
      color: theme.palette.grey[500],
    },
    monospace: {
      fontFamily: theme.custom.fonts.monospace,
    },
  }),
)

/**
 * Mapping from SegmentType to human-friendly values.
 */
const SegmentTypeToHeading = {
  [SegmentType.Country]: 'Countries',
  [SegmentType.Locale]: 'Locales',
}

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
  return (
    <Table className={classes.root}>
      <TableHead>
        <TableRow>
          <TableCell component='th' variant='head'>
            {SegmentTypeToHeading[type]}
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {resolvedSegmentAssignments.length === 0 ? (
          <TableRow>
            <TableCell className={classes.monospace}>
              All {type === SegmentType.Country ? 'countries' : 'locales'} included
            </TableCell>
          </TableRow>
        ) : (
          sortedResolvedSegmentAssignments.map(
            (resolvedSegmentAssignment) =>
              resolvedSegmentAssignment.segment && (
                <TableRow key={resolvedSegmentAssignment.segment.segmentId}>
                  <TableCell className={classes.monospace}>
                    {resolvedSegmentAssignment.segment.name}{' '}
                    {resolvedSegmentAssignment.isExcluded && <Chip label='Excluded' variant='outlined' disabled />}
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
