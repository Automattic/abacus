import AnalysesApi from 'src/api/AnalysesApi'
import { validationErrorDisplayer } from 'src/test-helpers/test-utils'

describe('AnalysesApi.ts module', () => {
  describe('findByExperimentId', () => {
    it('should return a set of analyses with the expected shape', async () => {
      const analyses = await validationErrorDisplayer(AnalysesApi.findByExperimentId(123))
      expect(analyses.length).toBeGreaterThan(0)
    })
  })
})
