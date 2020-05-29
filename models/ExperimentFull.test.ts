import { Platform } from '@/models/Platform'
import { Status } from '@/models/Status'

import { ExperimentFull } from './ExperimentFull'
import { MetricAssignmentAttributionWindowSecondsEnum } from './MetricAssignment'

describe('models/ExperimentFull.ts module', () => {
  describe('ExperimentFull', () => {
    describe('fromApiData', () => {
      it('called with valid API data should create a new `ExperimentFull` instance', () => {
        const stagedExperimentFull = ExperimentFull.fromApiData({
          description: 'An example experiment.',
          end_datetime: '2020-02-29T00:00:00.000+00:00',
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
          start_datetime: '2020-01-01T03:00:00.000+00:00',
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
        expect(stagedExperimentFull).toEqual(
          new ExperimentFull({
            conclusionUrl: null,
            deployedVariationId: null,
            description: 'An example experiment.',
            endDatetime: new Date(Date.UTC(2020, 1, 29)),
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
            startDatetime: new Date(Date.UTC(2020, 0, 1, 3)),
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
          }),
        )

        const completedExperimentFull = ExperimentFull.fromApiData({
          conclusion_url: 'https://betterexperiments.wordpress.com/2020/03/01/example-conclusion',
          deployed_variation_id: 6,
          description: 'An example experiment.',
          end_datetime: '2020-02-29T00:00:00.000+00:00',
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
          start_datetime: '2020-01-01T03:00:00.000+00:00',
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
        expect(completedExperimentFull).toEqual(
          new ExperimentFull({
            conclusionUrl: 'https://betterexperiments.wordpress.com/2020/03/01/example-conclusion',
            deployedVariationId: 6,
            description: 'An example experiment.',
            endDatetime: new Date(Date.UTC(2020, 1, 29)),
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
            startDatetime: new Date(Date.UTC(2020, 0, 1, 3)),
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
          }),
        )
      })
    })

    describe('toApiData', () => {
      it('called on new experiment with minimal fields.', () => {
        const experiment = new ExperimentFull({
          experimentId: null,
          name: 'my_experiment',
          startDatetime: new Date(Date.UTC(2020, 4, 1)),
          endDatetime: new Date(Date.UTC(2020, 4, 4)),
          status: Status.Staging,
          platform: Platform.Wpcom,
          ownerLogin: 'wp_johnsmith',
          description: 'My first experiment.',
          existingUsersAllowed: true,
          p2Url: 'https://betterexperiments.a8c.com/2020-04-28/my-experiment',
          variations: [],
          segmentAssignments: [],
          metricAssignments: [],
        })

        expect(experiment.toApiData()).toEqual({
          name: 'my_experiment',
          description: 'My first experiment.',
          start_datetime: '2020-05-01T00:00:00.000+00:00',
          end_datetime: '2020-05-04T00:00:00.000+00:00',
          status: 'staging',
          platform: 'wpcom',
          owner_login: 'wp_johnsmith',
          experiment_id: null,
          existing_users_allowed: true,
          p2_url: 'https://betterexperiments.a8c.com/2020-04-28/my-experiment',
          metric_assignments: [],
          segment_assignments: [],
          variations: [],
        })
      })

      it('called on new experiment with maximal fields.', () => {
        const experiment = new ExperimentFull({
          experimentId: null,
          name: 'my_experiment',
          startDatetime: new Date(Date.UTC(2020, 4, 1)),
          endDatetime: new Date(Date.UTC(2020, 4, 4)),
          status: Status.Staging,
          platform: Platform.Wpcom,
          ownerLogin: 'wp_johnsmith',
          description: 'My first experiment.',
          existingUsersAllowed: true,
          p2Url: 'https://betterexperiments.a8c.com/2020-04-28/my-experiment',
          conclusionUrl: 'https://betterexperiments.a8c.com/2020-04-28/my-experiment/conclusion',
          deployedVariationId: 123,
          endReason: 'it ended',
          variations: [
            {
              name: 'foo_bar',
              isDefault: true,
              allocatedPercentage: 47,
            },
          ],
          segmentAssignments: [
            {
              segmentId: 42,
              isExcluded: false,
            },
            {
              segmentId: 73,
              isExcluded: true,
            },
          ],
          metricAssignments: [
            {
              attributionWindowSeconds: MetricAssignmentAttributionWindowSecondsEnum.OneWeek,
              changeExpected: true,
              isPrimary: true,
              metricId: 4,
              minDifference: 0.05,
            },
          ],
        })
        expect(experiment.toApiData()).toEqual({
          name: 'my_experiment',
          description: 'My first experiment.',
          start_datetime: '2020-05-01T00:00:00.000+00:00',
          end_datetime: '2020-05-04T00:00:00.000+00:00',
          status: 'staging',
          platform: 'wpcom',
          owner_login: 'wp_johnsmith',
          conclusion_url: 'https://betterexperiments.a8c.com/2020-04-28/my-experiment/conclusion',
          deployed_variation_id: 123,
          end_reason: 'it ended',
          experiment_id: null,
          existing_users_allowed: true,
          p2_url: 'https://betterexperiments.a8c.com/2020-04-28/my-experiment',
          metric_assignments: [
            {
              experiment_id: undefined,
              metric_id: 4,
              attribution_window_seconds: 604800,
              change_expected: true,
              is_primary: true,
              min_difference: 0.05,
            },
          ],
          segment_assignments: [
            {
              experiment_id: undefined,
              segment_id: 42,
              is_excluded: false,
            },
            {
              experiment_id: undefined,
              segment_id: 73,
              is_excluded: true,
            },
          ],
          variations: [
            {
              experiment_id: undefined,
              name: 'foo_bar',
              is_default: true,
              allocated_percentage: 47,
            },
          ],
        })
      })
    })
  })
})
