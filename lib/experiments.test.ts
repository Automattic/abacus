import { normalize } from 'normalizr'

import Fixtures from '@/test-helpers/fixtures'

import * as Experiments from './experiments'
import {
  AnalysisStrategy,
  ExperimentFull,
  ExperimentFullNormalizedEntities,
  experimentFullNormalizrSchema,
  Platform,
} from './schemas'

describe('lib/experiments.ts module', () => {
  describe('getDeployedVariation', () => {
    it('should return null when no deployed variation declared', () => {
      const experiment = Fixtures.createExperimentFull()
      const normalizedExperimentData = normalize<ExperimentFull, ExperimentFullNormalizedEntities>(
        experiment,
        experimentFullNormalizrSchema,
      )

      expect(Experiments.getDeployedVariation(normalizedExperimentData)).toBeNull()
    })

    it('should return the deployed variation when declared', () => {
      const experiment = Fixtures.createExperimentFull({ deployedVariationId: 1 })
      const normalizedExperimentData = normalize<ExperimentFull, ExperimentFullNormalizedEntities>(
        experiment,
        experimentFullNormalizrSchema,
      )

      expect(Experiments.getDeployedVariation(normalizedExperimentData)).toEqual({
        variationId: 1,
        name: 'control',
        isDefault: true,
        allocatedPercentage: 60,
      })
    })

    it('should throw an error when deployed variation is declared but cannot be resolved', () => {
      const experiment = Fixtures.createExperimentFull({ deployedVariationId: 0 })
      const normalizedExperimentData = normalize<ExperimentFull, ExperimentFullNormalizedEntities>(
        experiment,
        experimentFullNormalizrSchema,
      )

      expect(() => {
        Experiments.getDeployedVariation(normalizedExperimentData)
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

  describe('hasConclusionData', () => {
    it('should return true if at least one piece of conclusion data is set', () => {
      expect(
        Experiments.hasConclusionData(
          Fixtures.createExperimentFull({
            conclusionUrl: 'https://betterexperiments.wordpress.com/experiment_1/conclusion',
          }),
        ),
      ).toBe(true)
      expect(Experiments.hasConclusionData(Fixtures.createExperimentFull({ deployedVariationId: 1 }))).toBe(true)
      expect(Experiments.hasConclusionData(Fixtures.createExperimentFull({ endReason: 'Ran its course.' }))).toBe(true)
    })

    it('should return false if no conclusion data is set', () => {
      expect(Experiments.hasConclusionData(Fixtures.createExperimentFull())).toBe(false)
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

  describe('createNewExperiment', () => {
    it('should return a new experiment', () => {
      expect(Experiments.createNewExperiment()).toEqual({
        platform: Platform.Wpcom,
        metricAssignments: [],
        segmentAssignments: [],
        variations: [
          { name: 'control', isDefault: true, allocatedPercentage: 50 },
          { name: 'treatment', isDefault: false, allocatedPercentage: 50 },
        ],
      })
    })
  })
})
