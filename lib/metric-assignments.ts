import _ from 'lodash'

import { AttributionWindowSeconds, MetricAssignment } from './schemas'

export const AttributionWindowSecondsToHuman: Record<AttributionWindowSeconds, string> = {
  [AttributionWindowSeconds.OneHour]: '1 hour',
  [AttributionWindowSeconds.SixHours]: '6 hours',
  [AttributionWindowSeconds.TwelveHours]: '12 hours',
  [AttributionWindowSeconds.TwentyFourHours]: '24 hours',
  [AttributionWindowSeconds.SeventyTwoHours]: '72 hours',
  [AttributionWindowSeconds.OneWeek]: '1 week',
  [AttributionWindowSeconds.TwoWeeks]: '2 weeks',
  [AttributionWindowSeconds.ThreeWeeks]: '3 weeks',
  [AttributionWindowSeconds.FourWeeks]: '4 weeks',
}

/**
 * Return the experiment's metric assignments sorted in a canonical order:
 * - Primary first
 * - Assignments with the same metricId are next to each other
 * - Assignments with the same metricId are ordered by attributionWindow asc
 * -
 */
export function sort(metricAssignments: MetricAssignment[]) {
  const metricAssignmentsByMetric = Object.values(_.groupBy(metricAssignments, 'metricId'))
    // Order within groups
    .map((metricAssignments) =>
      _.orderBy(metricAssignments, ['isPrimary', 'attributionWindowSeconds'], ['desc', 'asc']),
    )
  // Order the groups
  const orderedMetricAssignmentsByMetric = _.orderBy(
    metricAssignmentsByMetric,
    ['[0].isPrimary', '[0].metricId'],
    ['desc', 'asc'],
  )

  return _.flatten(orderedMetricAssignmentsByMetric)
}
