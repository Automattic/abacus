import { ValidationError } from 'yup'

import AnalysesApi from '@/api/AnalysesApi'

describe('AnalysesApi.ts module', () => {
  describe('findByExperimentId', () => {
    it('should return a set of analyses with the expected shape', async () => {
      try {
        const analyses = await AnalysesApi.findByExperimentId(123)
        expect(analyses.length).toBeGreaterThan(0)
      } catch (e) {
        if (e instanceof ValidationError) {
          expect(e.errors).toEqual([])
        }
        throw e
      }
    })
  })
})
