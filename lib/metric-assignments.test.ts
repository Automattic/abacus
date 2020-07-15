import Fixtures from '@/helpers/fixtures'

import * as MetricAssignments from './metric-assignments'
import { AttributionWindowSeconds } from './schemas'

describe('lib/metric-assignments.ts module', () => {
  describe('sort', () => {
    it('returns the metric assignments sorted in the canonical order', () => {
      const sortedMetricAssignments = [
        Fixtures.createMetricAssignment({
          metricAssignmentId: 123,
          metricId: 1,
          attributionWindowSeconds: AttributionWindowSeconds.OneWeek,
          changeExpected: true,
          isPrimary: true,
          minDifference: 0.1,
        }),
        Fixtures.createMetricAssignment({
          metricAssignmentId: 124,
          metricId: 2,
          attributionWindowSeconds: AttributionWindowSeconds.FourWeeks,
          changeExpected: false,
          isPrimary: false,
          minDifference: 10.5,
        }),
        Fixtures.createMetricAssignment({
          metricAssignmentId: 125,
          metricId: 3,
          attributionWindowSeconds: AttributionWindowSeconds.OneHour,
          changeExpected: false,
          isPrimary: false,
          minDifference: 0.05,
        }),
      ]

      expect(MetricAssignments.sort(sortedMetricAssignments)).toEqual(sortedMetricAssignments)
      expect(
        MetricAssignments.sort([sortedMetricAssignments[1], sortedMetricAssignments[0], sortedMetricAssignments[2]]),
      ).toEqual(sortedMetricAssignments)
      expect(
        MetricAssignments.sort([sortedMetricAssignments[2], sortedMetricAssignments[1], sortedMetricAssignments[0]]),
      ).toEqual(sortedMetricAssignments)
    })
  })
})
