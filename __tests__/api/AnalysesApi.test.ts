import AnalysesApi from '@/api/AnalysesApi'
import { AnalysisStrategy, RecommendationReason, RecommendationWarning } from '@/models'

describe('AnalysesApi.ts module', () => {
  describe('findByExperimentId', () => {
    it('should return a set of analyses with the expected shape', async () => {
      const analyses = await AnalysesApi.findByExperimentId(123)
      expect(analyses).toBeDefined()
      expect(Array.isArray(analyses)).toBe(true)
      expect(analyses.length).toBeGreaterThan(0)
      analyses.forEach((analysis) => {
        expect(typeof analysis.metricAssignmentId).toBe('number')
        expect(Object.values(AnalysisStrategy).includes(analysis.analysisStrategy)).toBe(true)
        expect(typeof analysis.participantStats.total).toBe('number')
        expect(typeof analysis.participantStats.not_final).toBe('number')
        expect(analysis.analysisDatetime).toBeInstanceOf(Date)
        if (analysis.metricEstimates !== null) {
          Object.entries(analysis.metricEstimates).forEach(([key, metricEstimate]) => {
            expect(typeof key).toBe('string')
            expect(typeof metricEstimate.estimate).toBe('number')
            expect(typeof metricEstimate.bottom).toBe('number')
            expect(typeof metricEstimate.top).toBe('number')
          })
        }
        if (analysis.recommendation !== null) {
          expect(typeof analysis.recommendation.endExperiment).toBe('boolean')
          if (analysis.recommendation.chosenVariationId !== null) {
            expect(typeof analysis.recommendation.chosenVariationId).toBe('number')
            expect(Object.values(RecommendationReason).includes(analysis.recommendation.reason)).toBe(true)
            analysis.recommendation.warnings.forEach((warning) => {
              expect(Object.values(RecommendationWarning).includes(warning)).toBe(true)
            })
          }
        }
      })
    })
  })
})
