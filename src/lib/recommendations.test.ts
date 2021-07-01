import Fixtures from 'src/test-helpers/fixtures'

import * as Recommendations from './recommendations'
import { AnalysisStrategy, RecommendationReason } from './schemas'

describe('getDiffCredibleIntervalStats', () => {
  it('should return null for missing analysis', () => {
    expect(Recommendations.getDiffCredibleIntervalStats(null, Fixtures.createMetricAssignment({}))).toBe(null)
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({ metricEstimates: null }),
        Fixtures.createMetricAssignment({}),
      ),
    ).toBe(null)
  })

  it('should throw for bottom greater than top', () => {
    expect(() =>
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: 0,
              bottom: 10,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toThrowErrorMatchingInlineSnapshot(`"Invalid metricEstimates: bottom greater than top."`)
  })

  it('should return correct stats', () => {
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: 0,
              bottom: 0,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
      statisticallySignificant: false,
      isPositive: false,
    })
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: 10,
              bottom: 0,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
      statisticallySignificant: false,
      isPositive: false,
    })
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: 1,
              bottom: -1,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
      statisticallySignificant: false,
      isPositive: false,
    })
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: -1,
              bottom: -2,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
      statisticallySignificant: true,
      isPositive: false,
    })
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: 2,
              bottom: 1,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
      statisticallySignificant: true,
      isPositive: true,
    })
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: -1,
              bottom: -20,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
      statisticallySignificant: true,
      isPositive: false,
    })
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: 20,
              bottom: 1,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
      statisticallySignificant: true,
      isPositive: true,
    })
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: -10,
              bottom: -20,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
      statisticallySignificant: true,
      isPositive: false,
    })
    expect(
      Recommendations.getDiffCredibleIntervalStats(
        Fixtures.createAnalysis({
          metricEstimates: {
            diff: {
              estimate: 0,
              top: 20,
              bottom: 10,
            },
          },
        }),
        Fixtures.createMetricAssignment({
          minDifference: 10,
        }),
      ),
    ).toEqual({
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
      statisticallySignificant: true,
      isPositive: true,
    })
  })
})

describe('getMetricAssignmentRecommendation', () => {
  it('should work correctly for single analyses', () => {
    expect(
      Recommendations.getMetricAssignmentRecommendation(
        Fixtures.createExperimentFull(),
        Fixtures.createMetric(123),
        Fixtures.createAnalysis({
          analysisStrategy: AnalysisStrategy.PpNaive,
          recommendation: {
            endExperiment: false,
            chosenVariationId: null,
            reason: RecommendationReason.CiGreaterThanRope,
            warnings: [],
          },
          metricEstimates: {
            diff: {
              top: 1,
              bottom: 0,
              estimate: 0,
            },
          },
        }),
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.Inconclusive,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
      statisticallySignificant: false,
    })

    expect(
      Recommendations.getMetricAssignmentRecommendation(
        Fixtures.createExperimentFull(),
        Fixtures.createMetric(123),
        Fixtures.createAnalysis({
          analysisStrategy: AnalysisStrategy.PpNaive,
          recommendation: {
            endExperiment: false,
            chosenVariationId: null,
            reason: RecommendationReason.CiGreaterThanRope,
            warnings: [],
          },
          metricEstimates: {
            diff: {
              top: 1,
              bottom: 0.001,
              estimate: 0,
            },
          },
        }),
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.Inconclusive,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
      statisticallySignificant: true,
    })

    expect(
      Recommendations.getMetricAssignmentRecommendation(
        Fixtures.createExperimentFull(),
        Fixtures.createMetric(123),
        Fixtures.createAnalysis({
          analysisStrategy: AnalysisStrategy.PpNaive,
          recommendation: {
            endExperiment: true,
            chosenVariationId: null,
            reason: RecommendationReason.CiGreaterThanRope,
            warnings: [],
          },
          metricEstimates: {
            diff: {
              top: 0,
              bottom: 0,
              estimate: 0,
            },
          },
        }),
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.DeployAnyVariation,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
      statisticallySignificant: false,
    })

    expect(
      Recommendations.getMetricAssignmentRecommendation(
        Fixtures.createExperimentFull(),
        Fixtures.createMetric(123),
        Fixtures.createAnalysis({
          analysisStrategy: AnalysisStrategy.PpNaive,
          recommendation: {
            endExperiment: true,
            chosenVariationId: 2,
            reason: RecommendationReason.CiGreaterThanRope,
            warnings: [],
          },
          metricEstimates: {
            diff: {
              top: 2,
              bottom: 1,
              estimate: 0,
            },
          },
        }),
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.DeployChosenVariation,
      chosenVariationId: 2,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
      statisticallySignificant: true,
    })
  })

  expect(
    Recommendations.getMetricAssignmentRecommendation(
      Fixtures.createExperimentFull(),
      Fixtures.createMetric(123, { higherIsBetter: false }),
      Fixtures.createAnalysis({
        analysisStrategy: AnalysisStrategy.PpNaive,
        recommendation: {
          endExperiment: true,
          chosenVariationId: 1,
          reason: RecommendationReason.CiGreaterThanRope,
          warnings: [],
        },
        metricEstimates: {
          diff: {
            top: 2,
            bottom: 1,
            estimate: 0,
          },
        },
      }),
    ),
  ).toEqual({
    analysisStrategy: AnalysisStrategy.PpNaive,
    decision: Recommendations.Decision.DeployChosenVariation,
    chosenVariationId: 1,
    practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
    statisticallySignificant: true,
  })
})

describe('getAggregateMetricAssignmentRecommendation', () => {
  it('should work correctly for missing analyses', () => {
    expect(Recommendations.getAggregateMetricAssignmentRecommendation([], AnalysisStrategy.PpNaive)).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.MissingAnalysis,
    })
    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.MissingAnalysis,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.MissingAnalysis,
    })
    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.IttPure,
            decision: Recommendations.Decision.Inconclusive,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.MissingAnalysis,
    })
  })

  it('should work correctly for multiple analyses without conflict', () => {
    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.DeployChosenVariation,
            chosenVariationId: 2,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
            statisticallySignificant: true,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            decision: Recommendations.Decision.DeployChosenVariation,
            chosenVariationId: 2,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
            statisticallySignificant: true,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.DeployChosenVariation,
      chosenVariationId: 2,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
      statisticallySignificant: true,
    })

    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.DeployChosenVariation,
            chosenVariationId: 2,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
            statisticallySignificant: true,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            decision: Recommendations.Decision.MissingAnalysis,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.DeployChosenVariation,
      chosenVariationId: 2,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
      statisticallySignificant: true,
    })

    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.DeployAnyVariation,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
            statisticallySignificant: false,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            decision: Recommendations.Decision.MissingAnalysis,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.DeployAnyVariation,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
      statisticallySignificant: false,
    })

    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.Inconclusive,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
            statisticallySignificant: false,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            decision: Recommendations.Decision.Inconclusive,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
            statisticallySignificant: false,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.Inconclusive,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
      statisticallySignificant: false,
    })
    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.MissingAnalysis,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            decision: Recommendations.Decision.Inconclusive,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
            statisticallySignificant: false,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.MissingAnalysis,
    })
  })
  it('should work correctly for multiple analyses with conflict', () => {
    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.DeployChosenVariation,
            chosenVariationId: 2,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
            statisticallySignificant: true,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            decision: Recommendations.Decision.DeployChosenVariation,
            chosenVariationId: 1,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
            statisticallySignificant: true,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.ManualAnalysisRequired,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
      statisticallySignificant: true,
    })

    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.DeployChosenVariation,
            chosenVariationId: 2,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
            statisticallySignificant: true,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            decision: Recommendations.Decision.DeployAnyVariation,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.No,
            statisticallySignificant: false,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.DeployChosenVariation,
      chosenVariationId: 2,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
      statisticallySignificant: true,
    })

    expect(
      Recommendations.getAggregateMetricAssignmentRecommendation(
        [
          {
            analysisStrategy: AnalysisStrategy.PpNaive,
            decision: Recommendations.Decision.DeployChosenVariation,
            chosenVariationId: 2,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
            statisticallySignificant: true,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            decision: Recommendations.Decision.DeployChosenVariation,
            chosenVariationId: 1,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
            statisticallySignificant: true,
          },
          {
            analysisStrategy: AnalysisStrategy.IttPure,
            decision: Recommendations.Decision.Inconclusive,
            practicallySignificant: Recommendations.PracticalSignificanceStatus.Uncertain,
            statisticallySignificant: false,
          },
          {
            analysisStrategy: AnalysisStrategy.MittNoCrossovers,
            decision: Recommendations.Decision.MissingAnalysis,
          },
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      analysisStrategy: AnalysisStrategy.PpNaive,
      decision: Recommendations.Decision.ManualAnalysisRequired,
      practicallySignificant: Recommendations.PracticalSignificanceStatus.Yes,
      statisticallySignificant: true,
    })
  })
})
