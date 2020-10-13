import Fixtures from 'src/test-helpers/fixtures'

import * as Experiments from './experiments'
import { AnalysisStrategy } from './schemas'

describe('lib/experiments.ts module', () => {
  describe('getDeployedVariation', () => {
    it('should return null when no deployed variation declared', () => {
      expect(Experiments.getDeployedVariation(Fixtures.createExperimentFull())).toBeNull()
    })

    it('should return the deployed variation when declared', () => {
      expect(Experiments.getDeployedVariation(Fixtures.createExperimentFull({ deployedVariationId: 1 }))).toEqual({
        variationId: 1,
        name: 'control',
        isDefault: true,
        allocatedPercentage: 60,
      })
    })

    it('should throw an error when deployed variation is declared but cannot be resolved', () => {
      expect(() => {
        Experiments.getDeployedVariation(Fixtures.createExperimentFull({ deployedVariationId: 0 }))
      }).toThrowError()
    })
  })

  describe('getPrimaryMetricAssignmentId', () => {
    it('returns the primary assignment ID when it exists', () => {
      expect(Experiments.getPrimaryMetricAssignmentId(Fixtures.createExperimentFull())).toBe(123)
    })

    it('returns undefined when no primary assignment ID exists', () => {
      expect(
        Experiments.getPrimaryMetricAssignmentId(Fixtures.createExperimentFull({ metricAssignments: [] })),
      ).toBeNull()
    })
  })

  describe('getDefaultAnalysisSummary', () => {
    it('returns the correct strategy based on the exposureEvents', () => {
      expect(Experiments.getDefaultAnalysisStrategy(Fixtures.createExperimentFull({ exposureEvents: null }))).toBe(
        AnalysisStrategy.MittNoSpammersNoCrossovers,
      )
      expect(
        Experiments.getDefaultAnalysisStrategy(Fixtures.createExperimentFull({ exposureEvents: [{ event: 'ev1' }] })),
      ).toBe(AnalysisStrategy.PpNaive)
    })
  })
})
