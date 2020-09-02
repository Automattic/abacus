import { format } from 'date-fns'
import MockDate from 'mockdate'

import ExperimentsApi from '@/api/ExperimentsApi'
import { ExperimentFull, ExperimentFullNew, experimentFullNewOutboundSchema } from '@/lib/schemas'
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
