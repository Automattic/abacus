import MockDate from 'mockdate'

import ExperimentsApi from '@/api/ExperimentsApi'
import { ExperimentFull, ExperimentFullNew, experimentFullNewOutboundSchema, Status } from '@/lib/schemas'
import Fixtures from '@/test-helpers/fixtures'
import { validationErrorDisplayer } from '@/test-helpers/test-utils'
import { formatIsoDate } from '@/utils/time'

MockDate.set('2020-08-13')

const now = new Date()
now.setDate(now.getDate() + 1)
const nextWeek = new Date()
nextWeek.setDate(now.getDate() + 7)

const createRawNewExperiment = () => ({
  p2Url: 'http://example.com/',
  name: 'test_experiment_name',
  description: 'experiment description',
  startDatetime: formatIsoDate(now),
  endDatetime: formatIsoDate(nextWeek),
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
})

describe('ExperimentsApi.ts module', () => {
  describe('create', () => {
    it('should transform a new experiment into a valid outbound form', () => {
      const newExperiment = experimentFullNewOutboundSchema.cast(createRawNewExperiment())

      expect(newExperiment).toEqual({
        description: 'experiment description',
        end_datetime: formatIsoDate(nextWeek),
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
        start_datetime: formatIsoDate(now),
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
      const returnedExperiment = await validationErrorDisplayer(
        ExperimentsApi.create((createRawNewExperiment() as unknown) as ExperimentFullNew),
      )
      expect(returnedExperiment.experimentId).toBeGreaterThan(0)
    })
  })

  describe('put', () => {
    it('should put an existing experiment', async () => {
      const returnedExperiment = await validationErrorDisplayer(
        ExperimentsApi.put(1, (createRawNewExperiment() as unknown) as ExperimentFullNew),
      )
      expect(returnedExperiment.experimentId).toEqual(1)
    })
  })

  describe('patch', () => {
    it('should patch an existing experiment', async () => {
      const rawNewExperiment = {
        description: 'experiment description',
        endDatetime: formatIsoDate(nextWeek),
        ownerLogin: 'owner-nickname',
      }
      const returnedExperiment = await validationErrorDisplayer(
        ExperimentsApi.patch(1, (rawNewExperiment as unknown) as Partial<ExperimentFull>),
      )
      expect(returnedExperiment.experimentId).toBeGreaterThan(0)
    })
  })

  describe('assignMetric', () => {
    it('should assign a metric', async () => {
      // This is the non-unit test version of above
      const experiment = Fixtures.createExperimentFull()
      const newMetricAssignment = Fixtures.createMetricAssignment({ metricAssignmentId: undefined })
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
