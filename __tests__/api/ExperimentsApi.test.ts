import ExperimentsApi from '@/api/ExperimentsApi'
import { validationErrorDisplayer } from '@/helpers/test-utils'
import { Platform, Status } from '@/lib/schemas'

describe('ExperimentsApi.ts module', () => {
  describe('create', () => {
    it('should create a new experiment', async () => {
      const experiment = await validationErrorDisplayer(
        ExperimentsApi.create({
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
        }),
      )
      expect(experiment.experimentId).toBeGreaterThan(0)
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
