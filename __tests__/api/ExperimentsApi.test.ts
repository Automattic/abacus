import ExperimentsApi from '@/api/ExperimentsApi'
import Fixtures from '@/helpers/fixtures'
import { validationErrorDisplayer } from '@/helpers/test-utils'

describe('ExperimentsApi.ts module', () => {
  describe('create', () => {
    it('should create a new experiment', async () => {
      const experiment = await validationErrorDisplayer(ExperimentsApi.create(Fixtures.createExperimentFullNew()))
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
