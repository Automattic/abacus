import { createStyles, makeStyles, Paper, Toolbar, Typography } from '@material-ui/core'
import { TableCellProps } from '@material-ui/core/TableCell'
import _ from 'lodash'
import React, { useMemo } from 'react'

import LabelValueTable from '@/components/LabelValueTable'
import SegmentsTable from '@/components/SegmentsTable'
import VariationsTable from '@/components/VariationsTable'
import { ExperimentFull, Segment, SegmentAssignment, SegmentType } from '@/lib/schemas'
import * as Variations from '@/lib/variations'
import theme from '@/styles/theme'

/**
 * Resolves the segment ID of the segment assignment with the actual segment.
 * If the ID cannot be resolved, then an `Error` will be thrown.
 *
 * @param segmentAssignments - The segment assignments to be resolved.
 * @param segments - The segments to associate with the assignments.
 * @throws {Error} When unable to resolve a segment ID with one of the supplied
 *   segments.
 */
function resolveSegmentAssignments(
  segmentAssignments: SegmentAssignment[],
  segments: Segment[],
): {
  segment: Segment
  isExcluded: boolean
}[] {
  const segmentsById: { [segmentId: string]: Segment } = {}
  segments.forEach((segment) => (segmentsById[segment.segmentId] = segment))

  return segmentAssignments.map((segmentAssignment) => {
    const segment = segmentsById[segmentAssignment.segmentId]

    if (!segment) {
      throw Error(
        `Failed to lookup segment with ID ${segmentAssignment.segmentId} for assignment with ID ${segmentAssignment.segmentAssignmentId}.`,
      )
    }

    return {
      segment,
      isExcluded: segmentAssignment.isExcluded,
    }
  })
}

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      flexGrow: 1,
    },
  }),
)

const eventStyles = makeStyles(() =>
  createStyles({
    entry: {
      display: 'block',
      fontFamily: theme.custom.fonts.monospace,
      color: 'gray',
    },
    eventName: {
      fontFamily: theme.custom.fonts.monospace,
    },
    eventList: {
      '& p:not(:first-child)': {
        paddingTop: theme.spacing(2),
      },
      '& p': {
        paddingBottom: theme.spacing(2),
      },
      '& p:not(:last-child)': {
        borderBottom: '1px solid rgb(224,224,224)',
      },
    },
  }),
)

function ExposureEventsTable({ experiment: { exposureEvents } }: { experiment: ExperimentFull }) {
  const classes = eventStyles()

  return (
    <div className={classes.eventList}>
      {exposureEvents && exposureEvents.length ? (
        exposureEvents.map((ev) => (
          <Typography key={ev.event}>
            <span className={classes.eventName}>{ev.event}</span>
            {ev.props &&
              Object.entries(ev.props).map(([key, val]) => (
                <span key={key} className={classes.entry}>
                  {key}: {val}
                </span>
              ))}
          </Typography>
        ))
      ) : (
        <Typography>No exposure events defined</Typography>
      )}
    </div>
  )
}

/**
 * Renders the audience information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the audience information.
 * @param props.segments - The segments to look up (aka resolve) the segment IDs
 *   of the experiment's segment assignments.
 */
function AudiencePanel({ experiment, segments }: { experiment: ExperimentFull; segments: Segment[] }) {
  const classes = useStyles()

  const segmentsByType = useMemo(
    () => _.groupBy(resolveSegmentAssignments(experiment.segmentAssignments, segments), _.property('segment.type')),
    [experiment.segmentAssignments, segments],
  )

  const data = [
    { label: 'Platform', value: experiment.platform },
    { label: 'User Type', value: experiment.existingUsersAllowed ? 'All users (new + existing)' : 'New users only' },
    {
      label: 'Variations',
      padding: 'none' as TableCellProps['padding'],
      value: <VariationsTable variations={Variations.sort(experiment.variations)} />,
    },
    {
      label: 'Segments',
      padding: 'none' as TableCellProps['padding'],
      value: (
        <>
          <SegmentsTable
            resolvedSegmentAssignments={segmentsByType[SegmentType.Locale] ?? []}
            type={SegmentType.Locale}
          />
          <SegmentsTable
            resolvedSegmentAssignments={segmentsByType[SegmentType.Country] ?? []}
            type={SegmentType.Country}
          />
        </>
      ),
    },
    {
      label: 'Exposure Events',
      value: <ExposureEventsTable experiment={experiment} />,
    },
  ]
  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.title} color='textPrimary' variant='h3'>
          Audience
        </Typography>
      </Toolbar>
      <LabelValueTable data={data} />
    </Paper>
  )
}

export default AudiencePanel
