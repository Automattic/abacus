import AnalysesApi from '@/api/AnalysesApi'

describe('AnalysesApi.ts module', () => {
  describe('findByExperimentId', () => {
    it('should return a set of analyses with the expected shape', async () => {
      await AnalysesApi.findByExperimentId(123)
    })
  })
})
