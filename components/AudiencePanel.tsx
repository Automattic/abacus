import { TableCellProps } from '@material-ui/core/TableCell'
import _ from 'lodash'
import React, { useMemo } from 'react'

import LabelValuePanel from '@/components/LabelValuePanel'
import SegmentsTable from '@/components/SegmentsTable'
import VariationsTable from '@/components/VariationsTable'
import { ExperimentFull, Segment, SegmentAssignment, SegmentType } from '@/models'

/**
 * Resolves the segment ID of the segment assignment with the actual segment.
 * If the ID cannot be resolved, then an `Error` will be thrown.
 *
 * @param
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

/**
 * Renders the audience information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the audience information.
 * @param props.segments - The segments to look up (aka resolve) the segment IDs
 *   of the experiment's segment assignments.
 */
function AudiencePanel({ experiment, segments }: { experiment: ExperimentFull; segments: Segment[] }) {
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
      value: <VariationsTable variations={experiment.variations} />,
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
  ]
  return <LabelValuePanel data={data} title='Audience' />
}

export default AudiencePanel
