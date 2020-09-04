/* eslint-disable @typescript-eslint/ban-ts-ignore, @typescript-eslint/require-await */
import { format } from 'date-fns'
import MockDate from 'mockdate'

import ExperimentsApi from '@/api/ExperimentsApi'
import { ExperimentFull, ExperimentFullNew, experimentFullNewOutboundSchema, MetricAssignmentNew, Status } from '@/lib/schemas'
import Fixtures from '@/test-helpers/fixtures'
import { validationErrorDisplayer } from '@/test-helpers/test-utils'

MockDate.set('2020-08-13')

describe('ExperimentsApi.ts module', () => {
  describe('create', () => {
    it('should transform a new experiment into a valid outbound form', () => {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      const nextWeek = new Date()
      nextWeek.setDate(now.getDate() + 7)
      const rawNewExperiment = {
        p2Url: 'http://example.com/',
        name: 'test_experiment_name',
        description: 'experiment description',
        startDatetime: format(now, 'yyyy-MM-dd'),
        endDatetime: format(nextWeek, 'yyyy-MM-dd'),
        ownerLogin: 'owner-nickname',
        platform: 'wpcom',
        existingUsersAllowed: 'true',
        exposureEvents: [
          {
            event: 'event_name',
            props: [
              {
                key: 'key',
                value: 'value',
              },
            ],
          },
        ],
        segmentAssignments: [
          {
            isExcluded: false,
            segmentId: 3,
          },
        ],
        variations: [
          {
            allocatedPercentage: 50,
            isDefault: true,
            name: 'control',
          },
          {
            allocatedPercentage: 50,
            isDefault: false,
            name: 'treatment',
          },
        ],
        metricAssignments: [
          {
            attributionWindowSeconds: '86400',
            changeExpected: false,
            isPrimary: true,
            metricId: 10,
            minDifference: 0.01,
          },
        ],
      }

      const newExperiment = experimentFullNewOutboundSchema.cast(rawNewExperiment)

      expect(newExperiment).toEqual({
        description: 'experiment description',
        end_datetime: format(nextWeek, 'yyyy-MM-dd'),
        existing_users_allowed: 'true',
        exposure_events: [
          {
            event: 'event_name',
            props: {
              key: 'value',
            },
          },
        ],
        metric_assignments: [
          {
            attribution_window_seconds: '86400',
            change_expected: false,
            is_primary: true,
            metric_id: 10,
            min_difference: 0.01,
          },
        ],
        name: 'test_experiment_name',
        owner_login: 'owner-nickname',
        p2_url: 'http://example.com/',
        p_2_url: undefined,
        platform: 'wpcom',
        segment_assignments: [
          {
            is_excluded: false,
            segment_id: 3,
          },
        ],
        start_datetime: format(now, 'yyyy-MM-dd'),
        variations: [
          {
            allocated_percentage: 50,
            is_default: true,
            name: 'control',
          },
          {
            allocated_percentage: 50,
            is_default: false,
            name: 'treatment',
          },
        ],
      })
    })

    it('should create a new experiment', async () => {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      const nextWeek = new Date()
      nextWeek.setDate(now.getDate() + 7)
      const rawNewExperiment = {
        p2Url: 'http://example.com/',
        name: 'test_experiment_name',
        description: 'experiment description',
        startDatetime: format(now, 'yyyy-MM-dd'),
        endDatetime: format(nextWeek, 'yyyy-MM-dd'),
        ownerLogin: 'owner-nickname',
        platform: 'wpcom',
        existingUsersAllowed: 'true',
        exposureEvents: [
          {
            event: 'event_name',
            props: [
              {
                key: 'key',
                value: 'value',
              },
            ],
          },
        ],
        segmentAssignments: [
          {
            isExcluded: false,
            segmentId: 3,
          },
        ],
        variations: [
          {
            allocatedPercentage: 50,
            isDefault: true,
            name: 'control',
          },
          {
            allocatedPercentage: 50,
            isDefault: false,
            name: 'treatment',
          },
        ],
        metricAssignments: [
          {
            attributionWindowSeconds: '86400',
            changeExpected: false,
            isPrimary: true,
            metricId: 10,
            minDifference: 0.01,
          },
        ],
      }
      const returnedExperiment = await validationErrorDisplayer(
        ExperimentsApi.create((rawNewExperiment as unknown) as ExperimentFullNew),
      )
      expect(returnedExperiment.experimentId).toBeGreaterThan(0)
    })
  })

  describe('patch', () => {
    it('should patch an existing experiment', async () => {
      const now = new Date()
      now.setDate(now.getDate() + 1)
      const nextWeek = new Date()
      nextWeek.setDate(now.getDate() + 7)
      const rawNewExperiment = {
        description: 'experiment description',
        endDatetime: format(nextWeek, 'yyyy-MM-dd'),
        ownerLogin: 'owner-nickname',
      }
      const returnedExperiment = await validationErrorDisplayer(
        ExperimentsApi.patch(1, (rawNewExperiment as unknown) as Partial<ExperimentFull>),
      )
      expect(returnedExperiment.experimentId).toBeGreaterThan(0)
    })
  })

  describe('assignMetric', () => {
    it('should make the right request', async () => {
      // NOTE: We are unit testing this one as the request it makes isn't so simple
      const experiment = Fixtures.createExperimentFull()

      // @ts-ignore
      const origFetch = global.fetch
      // @ts-ignore
      global.fetch = jest.fn().mockImplementationOnce(async () => ({
        json: async () => experiment,
      }))

      const newMetricAssignment = Fixtures.createMetricAssignment({}) as MetricAssignmentNew
      // @ts-ignore
      newMetricAssignment.metricAssignmentId = undefined
      await validationErrorDisplayer(ExperimentsApi.assignMetric(experiment, newMetricAssignment))
      // @ts-ignore
      expect(global.fetch).toHaveBeenCalledTimes(1)
      // @ts-ignore
      expect(global.fetch).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              "https://virtserver.swaggerhub.com/yanir/experiments/0.1.0/experiments/1",
              Object {
                "body": "{\\"metric_assignments\\":[{\\"metric_id\\":1,\\"attribution_window_seconds\\":604800,\\"change_expected\\":true,\\"is_primary\\":true,\\"min_difference\\":0.1},{\\"metric_id\\":2,\\"attribution_window_seconds\\":2419200,\\"change_expected\\":false,\\"is_primary\\":false,\\"min_difference\\":10.5},{\\"metric_id\\":2,\\"attribution_window_seconds\\":3600,\\"change_expected\\":true,\\"is_primary\\":false,\\"min_difference\\":0.5},{\\"metric_id\\":3,\\"attribution_window_seconds\\":21600,\\"change_expected\\":true,\\"is_primary\\":false,\\"min_difference\\":12},{\\"metric_id\\":1,\\"attribution_window_seconds\\":604800,\\"change_expected\\":true,\\"is_primary\\":true,\\"min_difference\\":0.1}]}",
                "headers": Headers {
                  "_headers": Object {
                    "content-type": Array [
                      "application/json",
                    ],
                  },
                },
                "method": "PATCH",
              },
            ],
          ],
          "results": Array [
            Object {
              "type": "return",
              "value": Promise {},
            },
          ],
        }
      `)

      // @ts-ignore
      global.fetch = origFetch
    })

    it('should assign a metric', async () => {
      // This is the non-unit test version of above
      const experiment = Fixtures.createExperimentFull()
      const newMetricAssignment = Fixtures.createMetricAssignment({}) as MetricAssignmentNew
      // @ts-ignore
      newMetricAssignment.metricAssignmentId = undefined
      await validationErrorDisplayer(ExperimentsApi.assignMetric(experiment, newMetricAssignment))
    })
  })

  describe('changeStatus', () => {
    it('should disable an existing experiment', async () => {
      await validationErrorDisplayer(ExperimentsApi.changeStatus(1, Status.Disabled))
    })

    it('should run an existing experiment', async () => {
      await validationErrorDisplayer(ExperimentsApi.changeStatus(1, Status.Running))
    })
  })

  describe('findAll', () => {
    it('should return a set of experiments with the expected experiment shape', async () => {
      const experiments = await validationErrorDisplayer(ExperimentsApi.findAll())
      expect(experiments.length).toBeGreaterThan(0)
    })
  })

  describe('findById', () => {
    it('should return an experiment with the expected experiment shape', async () => {
      const experiment = await validationErrorDisplayer(ExperimentsApi.findById(123))
      expect(experiment.experimentId).toBeGreaterThan(0)
    })
  })
})
