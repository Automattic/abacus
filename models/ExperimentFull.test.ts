import { Platform } from '@/models/Platform'
import { Status } from '@/models/Status'

import { ExperimentFull } from './ExperimentFull'
import { MetricAssignmentAttributionWindowSecondsEnum } from './MetricAssignment'

describe('models/ExperimentFull.ts module', () => {
  describe('ExperimentFull', () => {
    describe('constructor', () => {
      it('called with valid API data should create a new `ExperimentFull` instance', () => {
        const stagedExperimentFull = new ExperimentFull({
          description: 'An example experiment.',
          end_datetime: '2020-02-29',
          existing_users_allowed: true,
          experiment_id: 123,
          exposure_events: null,
          metric_assignments: [
            {
              attribution_window_seconds: 3600,
              change_expected: true,
              experiment_id: 123,
              is_primary: false,
              metric_assignment_id: 12,
              metric_id: 42,
              min_difference: 4,
            },
          ],
          name: 'Example Experiment',
          p2_url: 'https://betterexperiments.wordpress.com/2020/05/01/example',
          platform: 'calypso',
          owner_login: 'a12n',
          segment_assignments: [
            {
              is_excluded: true,
              experiment_id: 123,
              segment_assignment_id: 1,
              segment_id: 2,
            },
          ],
          start_datetime: '2020-01-01',
          status: 'staging',
          variations: [
            {
              allocated_percentage: 50,
              experiment_id: 123,
              is_default: true,
              name: 'United States',
              variation_id: 6,
            },
          ],
        })
        expect(stagedExperimentFull).toEqual({
          conclusionUrl: null,
          deployedVariationId: null,
          description: 'An example experiment.',
          endDatetime: new Date(2020, 1, 29),
          endReason: null,
          existingUsersAllowed: true,
          experimentId: 123,
          exposureEvents: null,
          metricAssignments: [
            {
              attributionWindowSeconds: MetricAssignmentAttributionWindowSecondsEnum.OneHour,
              changeExpected: true,
              experimentId: 123,
              isPrimary: false,
              metricAssignmentId: 12,
              metricId: 42,
              minDifference: 4,
            },
          ],
          name: 'Example Experiment',
          platform: Platform.Calypso,
          p2Url: 'https://betterexperiments.wordpress.com/2020/05/01/example',
          ownerLogin: 'a12n',
          segmentAssignments: [
            {
              isExcluded: true,
              experimentId: 123,
              segmentAssignmentId: 1,
              segmentId: 2,
            },
          ],
          startDatetime: new Date(2020, 0, 1),
          status: Status.Staging,
          variations: [
            {
              allocatedPercentage: 50,
              experimentId: 123,
              isDefault: true,
              name: 'United States',
              variationId: 6,
            },
          ],
        })

        const completedExperimentFull = new ExperimentFull({
          conclusion_url: 'https://betterexperiments.wordpress.com/2020/03/01/example-conclusion',
          deployed_variation_id: 6,
          description: 'An example experiment.',
          end_datetime: '2020-02-29',
          end_reason: 'Successful completion.',
          existing_users_allowed: true,
          experiment_id: 123,
          exposure_events: [
            {
              event: 'foo',
              props: {
                foo: 'bar',
              },
            },
          ],
          metric_assignments: [
            {
              attribution_window_seconds: 3600,
              change_expected: true,
              experiment_id: 123,
              is_primary: false,
              metric_assignment_id: 12,
              metric_id: 42,
              min_difference: 4,
            },
          ],
          name: 'Example Experiment',
          p2_url: 'https://betterexperiments.wordpress.com/2020/05/01/example',
          platform: 'calypso',
          owner_login: 'a12n',
          segment_assignments: [
            {
              is_excluded: true,
              experiment_id: 123,
              segment_assignment_id: 1,
              segment_id: 2,
            },
          ],
          start_datetime: '2020-01-01',
          status: 'completed',
          variations: [
            {
              allocated_percentage: 50,
              experiment_id: 123,
              is_default: true,
              name: 'United States',
              variation_id: 6,
            },
          ],
        })
        expect(completedExperimentFull).toEqual({
          conclusionUrl: 'https://betterexperiments.wordpress.com/2020/03/01/example-conclusion',
          deployedVariationId: 6,
          description: 'An example experiment.',
          endDatetime: new Date(2020, 1, 29),
          endReason: 'Successful completion.',
          existingUsersAllowed: true,
          experimentId: 123,
          exposureEvents: [
            {
              event: 'foo',
              props: {
                foo: 'bar',
              },
            },
          ],
          metricAssignments: [
            {
              attributionWindowSeconds: MetricAssignmentAttributionWindowSecondsEnum.OneHour,
              changeExpected: true,
              experimentId: 123,
              isPrimary: false,
              metricAssignmentId: 12,
              metricId: 42,
              minDifference: 4,
            },
          ],
          name: 'Example Experiment',
          platform: Platform.Calypso,
          p2Url: 'https://betterexperiments.wordpress.com/2020/05/01/example',
          ownerLogin: 'a12n',
          segmentAssignments: [
            {
              isExcluded: true,
              experimentId: 123,
              segmentAssignmentId: 1,
              segmentId: 2,
            },
          ],
          startDatetime: new Date(2020, 0, 1),
          status: Status.Completed,
          variations: [
            {
              allocatedPercentage: 50,
              experimentId: 123,
              isDefault: true,
              name: 'United States',
              variationId: 6,
            },
          ],
        })
      })
    })
  })
})
