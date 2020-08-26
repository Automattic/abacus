import { format } from 'date-fns'

import ExperimentsApi from '@/api/ExperimentsApi'
import { experimentFullNewSchema, ExperimentFullNew } from '@/lib/schemas'
import { validationErrorDisplayer } from '@/test-helpers/test-utils'

describe('ExperimentsApi.ts module', () => {
  describe('create', () => {
    it('should create a new experiment', async () => {
      // We need to make some dates relative to today since mocking the schema to work with MockDate is a pain!
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
      const returnedExperiment = await validationErrorDisplayer(ExperimentsApi.create(rawNewExperiment as unknown as ExperimentFullNew))
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
