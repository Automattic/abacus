import ExperimentsApi from '@/api/ExperimentsApi'

import { ExperimentFull, Platform, Status } from '@/models/index'

const PLATFORMS = Object.values(Platform)
const STATUSES = Object.values(Status)

describe('ExperimentsApi.ts module', () => {
  describe('create', () => {
    it('should create a new experiment', async () => {
      const apiData = await ExperimentsApi.create(
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
      // mock values, we'll test that it is valid to create an instance from the data.
      expect(apiData).toBeDefined()
      expect(() => {
        ExperimentFull.fromApiData(apiData)
      }).not.toThrowError()
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
})
