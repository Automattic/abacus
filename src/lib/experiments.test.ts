import Fixtures from 'src/test-helpers/fixtures'

import * as Experiments from './experiments'
import { AnalysisStrategy, Status } from './schemas'

import MockDate from 'mockdate'

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

  describe('getExperimentDurationDays', () => {
    it('returns the correct number of days', () => {
      expect(
        Experiments.getExperimentDurationDays(Fixtures.createExperimentFull({
          status: Status.Staging,
          startDatetime: new Date('2021-04-01T00:00:00Z'),
          endDatetime: new Date('2021-04-05T00:00:00Z'),
        }))
      ).toBe(0)
      MockDate.set('2021-04-04T00:00:00Z')
      expect(
        Experiments.getExperimentDurationDays(Fixtures.createExperimentFull({
          status: Status.Running,
          startDatetime: new Date('2021-04-01T00:00:00Z'),
          endDatetime: new Date('2021-04-05T00:00:00Z'),
        }))
      ).toBe(3)
      MockDate.set('2021-04-04T12:00:00Z')
      expect(
        Experiments.getExperimentDurationDays(Fixtures.createExperimentFull({
          status: Status.Running,
          startDatetime: new Date('2021-04-01T00:00:00Z'),
          endDatetime: new Date('2021-04-05T00:00:00Z'),
        }))
      ).toBe(3.5)
      expect(
        Experiments.getExperimentDurationDays(Fixtures.createExperimentFull({
          status: Status.Completed,
          startDatetime: new Date('2021-04-01T00:00:00Z'),
          endDatetime: new Date('2021-04-05T00:00:00Z'),
        }))
      ).toBe(4)
      expect(
        Experiments.getExperimentDurationDays(Fixtures.createExperimentFull({
          status: Status.Disabled,
          startDatetime: new Date('2021-04-01T00:00:00Z'),
          endDatetime: new Date('2021-04-05T00:00:00Z'),
        }))
      ).toBe(4)
    })
  })
})
