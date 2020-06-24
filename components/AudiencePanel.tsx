import { TableCellProps } from '@material-ui/core/TableCell'
import _ from 'lodash'
import React from 'react'

import LabelValuePanel from '@/components/LabelValuePanel'
import SegmentsTable from '@/components/SegmentsTable'
import VariationsTable from '@/components/VariationsTable'
import { ExperimentFull, Segment, SegmentType } from '@/models'

function AudiencePanel({ experiment, segments }: { experiment: ExperimentFull; segments: Segment[] }) {
  const segmentsByType = _.groupBy(experiment.resolveSegmentAssignments(segments), _.property('segment.type'))

  const countryResolvedSegmentAssignments = (segmentsByType[SegmentType.Country] ?? []).filter(
    (resolvedSegmentAssignment) => !!resolvedSegmentAssignment.segment,
  ) as { segment: Segment; isExcluded: boolean }[]

  const localeResolvedSegmentAssignments = (segmentsByType[SegmentType.Locale] ?? []).filter(
    (resolvedSegmentAssignment) => !!resolvedSegmentAssignment.segment,
  ) as { segment: Segment; isExcluded: boolean }[]

  const hasSegments = countryResolvedSegmentAssignments.length + localeResolvedSegmentAssignments.length > 0
  const data = [
    { label: 'Platform', value: experiment.platform },
    { label: 'User Type', value: experiment.existingUsersAllowed ? 'All User (new + existing)' : 'New users only' },
    {
      label: 'Variations',
      padding: 'none' as TableCellProps['padding'],
      value: <VariationsTable variations={experiment.variations} />,
    },
    {
      label: 'Segments',
      padding: (hasSegments ? 'none' : undefined) as TableCellProps['padding'],
      value: hasSegments ? (
        <>
          {countryResolvedSegmentAssignments.length > 0 && (
            <SegmentsTable resolvedSegmentAssignments={countryResolvedSegmentAssignments} type={SegmentType.Country} />
          )}
          {localeResolvedSegmentAssignments.length > 0 && (
            <SegmentsTable resolvedSegmentAssignments={localeResolvedSegmentAssignments} type={SegmentType.Locale} />
          )}
        </>
      ) : (
        'No segments assigned'
      ),
    },
  ]
  return <LabelValuePanel data={data} title='Audience' />
}

export default AudiencePanel
