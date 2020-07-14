import { ValidationError } from 'yup'

import AnalysesApi from '@/api/AnalysesApi'

describe('AnalysesApi.ts module', () => {
  describe('findByExperimentId', () => {
    it('should return a set of analyses with the expected shape', async () => {
      try {
        await AnalysesApi.findByExperimentId(123)
      } catch (e) {
        if (e instanceof ValidationError) {
          expect(e.errors).toEqual([])
        }
        throw e
      }
    })
  })
})
