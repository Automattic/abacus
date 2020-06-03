import ExperimentsApi from '@/api/ExperimentsApi'

import { ExperimentFull, Platform, Status } from '@/models/index'

const PLATFORMS = Object.values(Platform)
const STATUSES = Object.values(Status)

describe('ExperimentsApi.ts module', () => {
  describe('create', () => {
    it('should create a new experiment', async () => {
      const newExperiment = await ExperimentsApi.create(
        new ExperimentFull({
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
        }),
      )
      // We expect that the response will return the new experiment with its newly
      // assigned ID. These integration tests test against the "development" API which
      // only returns mock data. So, instead of trying to keep in sync with the actual
      // mock values, the fact that we are using TypeScript and we get a defined
      // instance should be pretty sufficient.
      expect(newExperiment).toBeDefined()
      expect(typeof newExperiment.experimentId).toBe('number')
    })
  })

  describe('findAll', () => {
    it('should return a set of experiments with the expected experiment shape', async () => {
      const experiments = await ExperimentsApi.findAll()
      expect(experiments).toBeDefined()
      expect(Array.isArray(experiments)).toBe(true)
      expect(experiments.length).toBeGreaterThan(0)
      experiments.forEach((experiment) => {
        expect(typeof experiment.experimentId).toBe('number')
        expect(typeof experiment.name).toBe('string')
        expect(experiment.startDatetime).toBeInstanceOf(Date)
        expect(experiment.endDatetime).toBeInstanceOf(Date)
        expect(PLATFORMS.includes(experiment.platform)).toBe(true)
        expect(STATUSES.includes(experiment.status)).toBe(true)
        expect(typeof experiment.ownerLogin).toBe('string')
      })
    })
  })

  describe('findById', () => {
    it('should return an experiment with the expected experiment shape', async () => {
      const experiment = await ExperimentsApi.findById(123)
      expect(experiment).toBeDefined()
      expect(typeof experiment.experimentId).toBe('number')
      expect(typeof experiment.name).toBe('string')
      expect(typeof experiment.description).toBe('string')
      expect(experiment.startDatetime).toBeInstanceOf(Date)
      expect(experiment.endDatetime).toBeInstanceOf(Date)
      expect(PLATFORMS.includes(experiment.platform)).toBe(true)
      expect(STATUSES.includes(experiment.status)).toBe(true)
      expect(typeof experiment.ownerLogin).toBe('string')
      expect(typeof experiment.existingUsersAllowed).toBe('boolean')
      expect(typeof experiment.p2Url).toBe('string')

      expect(Array.isArray(experiment.variations)).toBe(true)
      expect(Array.isArray(experiment.segmentAssignments)).toBe(true)
      expect(Array.isArray(experiment.metricAssignments)).toBe(true)
    })
  })
})
