import _ from 'lodash'

import { AttributionWindowSeconds, MetricAssignment } from './schemas'

export const AttributionWindowSecondsToHuman: Record<AttributionWindowSeconds, string> = {
  [AttributionWindowSeconds.OneHour]: '1 hour',
  [AttributionWindowSeconds.SixHours]: '6 hours',
  [AttributionWindowSeconds.TwelveHours]: '12 hours',
  [AttributionWindowSeconds.TwentyFourHours]: '24 hours',
  [AttributionWindowSeconds.ThreeDays]: '3 days',
  [AttributionWindowSeconds.OneWeek]: '1 week',
  [AttributionWindowSeconds.TwoWeeks]: '2 weeks',
  [AttributionWindowSeconds.ThreeWeeks]: '3 weeks',
  [AttributionWindowSeconds.FourWeeks]: '4 weeks',
}

/**
 * Return the experiment's variations sorted in the canonical order: Primary first, then by ID.
 */
export function sort(metricAssignments: MetricAssignment[]) {
  return _.orderBy(metricAssignments, ['isPrimary', 'metricAssignmentId'], ['desc', 'asc'])
}
