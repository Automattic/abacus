import Fixtures from 'src/test-helpers/fixtures'

import * as Analyses from './analyses'
import { AnalysisStrategy, RecommendationReason } from './schemas'

describe('getAggregateRecommendation', () => {
  it('should work correctly for single analyses', () => {
    expect(Analyses.getAggregateRecommendation([], AnalysisStrategy.PpNaive)).toEqual({
      decision: Analyses.AggregateRecommendationDecision.MissingAnalysis,
    })
    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: undefined,
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.MissingAnalysis,
    })
    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: false,
              chosenVariationId: null,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.Inconclusive,
    })
    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: null,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.DeployAnyVariation,
    })
    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 123,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.DeployChosenVariation,
      chosenVariationId: 123,
    })
  })

  it('should work correctly for multiple analyses without conflict', () => {
    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 123,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 123,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.DeployChosenVariation,
      chosenVariationId: 123,
    })

    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 123,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            recommendation: null,
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.DeployChosenVariation,
      chosenVariationId: 123,
    })

    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: null,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            recommendation: null,
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.DeployAnyVariation,
    })

    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: false,
              chosenVariationId: null,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            recommendation: {
              endExperiment: true,
              chosenVariationId: null,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.Inconclusive,
    })
    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: null,
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers,
            recommendation: {
              endExperiment: true,
              chosenVariationId: null,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.MissingAnalysis,
    })
  })
  it('should work correctly for multiple analyses with conflict', () => {
    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 123,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 456,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.ManualAnalysisRequired,
    })

    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 123,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: null,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.DeployChosenVariation,
      chosenVariationId: 123,
    })

    expect(
      Analyses.getAggregateRecommendation(
        [
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 123,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: true,
              chosenVariationId: 456,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: {
              endExperiment: false,
              chosenVariationId: null,
              reason: RecommendationReason.CiGreaterThanRope,
              warnings: [],
            },
          }),
          Fixtures.createAnalysis({
            analysisStrategy: AnalysisStrategy.PpNaive,
            recommendation: null,
          }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      decision: Analyses.AggregateRecommendationDecision.ManualAnalysisRequired,
    })
  })
})

describe('getParticipantCounts', () => {
  it('should work correctly', () => {
    expect(
      Analyses.getParticipantCounts(
        Fixtures.createExperimentFull({
          variations: [
            { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
            { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
          ],
        }),
        {
          [AnalysisStrategy.IttPure]: Fixtures.createAnalysis({
            participantStats: {
              total: 100,
              variation_1: 40,
              variation_2: 70,
            },
          }),
          [AnalysisStrategy.MittNoCrossovers]: Fixtures.createAnalysis({
            participantStats: {
              total: 90,
              variation_1: 35,
              variation_2: 55,
            },
          }),
          [AnalysisStrategy.MittNoSpammers]: Fixtures.createAnalysis({
            participantStats: {
              total: 85,
              variation_1: 40,
              variation_2: 45,
            },
          }),
          [AnalysisStrategy.MittNoSpammersNoCrossovers]: Fixtures.createAnalysis({
            participantStats: {
              total: 60,
              variation_1: 25,
              variation_2: 35,
            },
          }),
          [AnalysisStrategy.PpNaive]: Fixtures.createAnalysis({
            participantStats: {
              total: 40,
              variation_1: 15,
              variation_2: 25,
            },
          }),
        },
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "byVariationId": Object {
          "1": Object {
            "assigned": 40,
            "assignedCrossovers": 5,
            "assignedNoSpammersNoCrossovers": 25,
            "assignedSpammers": 0,
            "exposed": 15,
          },
          "2": Object {
            "assigned": 70,
            "assignedCrossovers": 15,
            "assignedNoSpammersNoCrossovers": 35,
            "assignedSpammers": 25,
            "exposed": 25,
          },
        },
        "total": Object {
          "assigned": 100,
          "assignedCrossovers": 10,
          "assignedNoSpammersNoCrossovers": 60,
          "assignedSpammers": 15,
          "exposed": 40,
        },
      }
    `)
  })

  it('should work correctly without any analyses', () => {
    expect(
      Analyses.getParticipantCounts(
        Fixtures.createExperimentFull({
          variations: [
            { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
            { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
          ],
        }),
        {},
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "byVariationId": Object {
          "1": Object {
            "assigned": 0,
            "assignedCrossovers": 0,
            "assignedNoSpammersNoCrossovers": 0,
            "assignedSpammers": 0,
            "exposed": 0,
          },
          "2": Object {
            "assigned": 0,
            "assignedCrossovers": 0,
            "assignedNoSpammersNoCrossovers": 0,
            "assignedSpammers": 0,
            "exposed": 0,
          },
        },
        "total": Object {
          "assigned": 0,
          "assignedCrossovers": 0,
          "assignedNoSpammersNoCrossovers": 0,
          "assignedSpammers": 0,
          "exposed": 0,
        },
      }
    `)
  })
})

describe('getExperimentParticipantStats', () => {
  it('should work correctly', () => {
    expect(
      Analyses.getExperimentParticipantStats(
        Fixtures.createExperimentFull({
          variations: [
            { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
            { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
          ],
        }),
        {
          [AnalysisStrategy.IttPure]: Fixtures.createAnalysis({
            participantStats: {
              total: 130,
              variation_1: 40,
              variation_2: 70,
            },
          }),
          [AnalysisStrategy.MittNoCrossovers]: Fixtures.createAnalysis({
            participantStats: {
              total: 90,
              variation_1: 35,
              variation_2: 55,
            },
          }),
          [AnalysisStrategy.MittNoSpammers]: Fixtures.createAnalysis({
            participantStats: {
              total: 85,
              variation_1: 40,
              variation_2: 45,
            },
          }),
          [AnalysisStrategy.MittNoSpammersNoCrossovers]: Fixtures.createAnalysis({
            participantStats: {
              total: 60,
              variation_1: 25,
              variation_2: 35,
            },
          }),
          [AnalysisStrategy.PpNaive]: Fixtures.createAnalysis({
            participantStats: {
              total: 40,
              variation_1: 15,
              variation_2: 27,
            },
          }),
        },
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "probabilities": Object {
          "byVariationId": Object {
            "1": Object {
              "assignedDistributionMatchingAllocated": 0.000011583130623216142,
              "assignedNoSpammersNoCrossoversDistributionMatchingAllocated": 0.19670560245894686,
              "exposedDistributionMatchingAllocated": 0.11384629800665802,
            },
            "2": Object {
              "assignedDistributionMatchingAllocated": 0.3804551252503884,
              "assignedNoSpammersNoCrossoversDistributionMatchingAllocated": 0.19670560245894686,
              "exposedDistributionMatchingAllocated": 0.026856695507524453,
            },
          },
        },
        "ratios": Object {
          "byVariationId": Object {
            "1": Object {
              "assignedCrossoversToAssigned": 0.125,
              "assignedCrossoversToTotalAssignedCrossovers": 0.125,
              "assignedNoSpammersNoCrossoversToAssigned": 0.625,
              "assignedSpammersToAssigned": 0,
              "assignedSpammersToTotalAssignedSpammers": 0,
              "assignedToTotalAssigned": 0.3076923076923077,
              "exposedToAssigned": 0.375,
              "exposedToTotalExposed": 0.375,
            },
            "2": Object {
              "assignedCrossoversToAssigned": 0.21428571428571427,
              "assignedCrossoversToTotalAssignedCrossovers": 0.375,
              "assignedNoSpammersNoCrossoversToAssigned": 0.5,
              "assignedSpammersToAssigned": 0.35714285714285715,
              "assignedSpammersToTotalAssignedSpammers": 0.5555555555555556,
              "assignedToTotalAssigned": 0.5384615384615384,
              "exposedToAssigned": 0.38571428571428573,
              "exposedToTotalExposed": 0.675,
            },
          },
          "overall": Object {
            "assignedCrossoversToAssigned": 0.3076923076923077,
            "assignedNoSpammersNoCrossoversToAssigned": 0.46153846153846156,
            "assignedSpammersToAssigned": 0.34615384615384615,
            "exposedToAssigned": 0.3076923076923077,
          },
        },
      }
    `)
  })
})

describe('getExperimentParticipantStatHealthIndicators', () => {
  it('should work correctly', () => {
    expect(
      Analyses.getExperimentParticipantHealthIndicators(
        Analyses.getExperimentParticipantStats(
          Fixtures.createExperimentFull({
            variations: [
              { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
              { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
            ],
          }),
          {
            [AnalysisStrategy.IttPure]: Fixtures.createAnalysis({
              participantStats: {
                total: 130,
                variation_1: 40,
                variation_2: 70,
              },
            }),
            [AnalysisStrategy.MittNoCrossovers]: Fixtures.createAnalysis({
              participantStats: {
                total: 90,
                variation_1: 35,
                variation_2: 55,
              },
            }),
            [AnalysisStrategy.MittNoSpammers]: Fixtures.createAnalysis({
              participantStats: {
                total: 85,
                variation_1: 40,
                variation_2: 45,
              },
            }),
            [AnalysisStrategy.MittNoSpammersNoCrossovers]: Fixtures.createAnalysis({
              participantStats: {
                total: 60,
                variation_1: 25,
                variation_2: 35,
              },
            }),
            [AnalysisStrategy.PpNaive]: Fixtures.createAnalysis({
              participantStats: {
                total: 40,
                variation_1: 15,
                variation_2: 27,
              },
            }),
          },
        ),
      ),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "indication": Object {
            "code": "probable issue",
            "reason": "−∞ < x ≤ 0.001",
            "recommendation": "Contact @experiment-review.",
            "severity": "Error",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#assignment-distribution-matching-allocated",
          "name": "Assignment distribution",
          "unit": "p-value",
          "value": 0.000011583130623216142,
        },
        Object {
          "indication": Object {
            "code": "nominal",
            "reason": "0.05 < x ≤ 1",
            "severity": "Ok",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#assigned-no-spammers-no-crossovers-distribution-matching-allocated",
          "name": "Assignment distribution without crossovers and spammers",
          "unit": "p-value",
          "value": 0.19670560245894686,
        },
        Object {
          "indication": Object {
            "code": "possible issue",
            "reason": "0.001 < x ≤ 0.05",
            "recommendation": "If not in combination with other distribution issues, exposure event being fired is linked to variation causing bias. Choose a different exposure event or use assignment analysis (contact @experiment-review to do so).",
            "severity": "Warning",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#exposure-event-distribution-matching-allocated-sample-ratio-mismatch",
          "name": "Assignment distribution of exposed participants",
          "unit": "p-value",
          "value": 0.026856695507524453,
        },
        Object {
          "indication": Object {
            "code": "very high",
            "reason": "0.05 < x ≤ 1",
            "recommendation": "Contact @experiment-review.",
            "severity": "Error",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-crossovers",
          "name": "Ratio of crossovers to assigned",
          "unit": "ratio",
          "value": 0.3076923076923077,
        },
        Object {
          "indication": Object {
            "code": "high",
            "reason": "0.1 < x ≤ 0.4",
            "recommendation": "Spammers are filtered out of the displayed metrics, but high numbers may be indicative of problems.",
            "severity": "Warning",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-spammers",
          "name": "Ratio of spammers to assigned",
          "unit": "ratio",
          "value": 0.34615384615384615,
        },
      ]
    `)
  })

  it('should handle bad values gracefully', () => {
    expect(
      Analyses.getExperimentParticipantHealthIndicators(
        Analyses.getExperimentParticipantStats(
          Fixtures.createExperimentFull({
            variations: [
              { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
              { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
            ],
          }),
          {
            [AnalysisStrategy.IttPure]: Fixtures.createAnalysis({
              participantStats: {
                total: 0,
                variation_1: 0,
                variation_2: 0,
              },
            }),
            [AnalysisStrategy.PpNaive]: Fixtures.createAnalysis({
              participantStats: {
                total: 0,
                variation_1: 0,
                variation_2: 0,
              },
            }),
          },
        ),
      ),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "indication": Object {
            "code": "nominal",
            "reason": "0.05 < x ≤ 1",
            "severity": "Ok",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#assignment-distribution-matching-allocated",
          "name": "Assignment distribution",
          "unit": "p-value",
          "value": 1,
        },
        Object {
          "indication": Object {
            "code": "nominal",
            "reason": "0.05 < x ≤ 1",
            "severity": "Ok",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#assigned-no-spammers-no-crossovers-distribution-matching-allocated",
          "name": "Assignment distribution without crossovers and spammers",
          "unit": "p-value",
          "value": 1,
        },
        Object {
          "indication": Object {
            "code": "value error",
            "reason": "Unexpected value",
            "recommendation": "Contact @experiment-review.",
            "severity": "Error",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-crossovers",
          "name": "Ratio of crossovers to assigned",
          "unit": "ratio",
          "value": NaN,
        },
        Object {
          "indication": Object {
            "code": "value error",
            "reason": "Unexpected value",
            "recommendation": "Contact @experiment-review.",
            "severity": "Error",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-spammers",
          "name": "Ratio of spammers to assigned",
          "unit": "ratio",
          "value": NaN,
        },
      ]
    `)
  })
})

describe('getExperimentAnalysesHealthIndicators', () => {
  it('should work correctly', () => {
    expect(
      Analyses.getExperimentAnalysesHealthIndicators(
        Fixtures.createExperimentFull({
          variations: [
            { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
            { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
          ],
        }),
        {
          [AnalysisStrategy.IttPure]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoCrossovers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoSpammers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoSpammersNoCrossovers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.PpNaive]: Fixtures.createAnalysis({
            metricEstimates: {
              diff: {
                top: 5,
                estimate: 0,
                bottom: 0,
              },
              ratio: {
                top: 2,
                estimate: 0,
                bottom: 0.1,
              },
            },
          }),
        },
        AnalysisStrategy.PpNaive,
      ),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "indication": Object {
            "code": "very high",
            "reason": "1.5 < x ≤ ∞",
            "recommendation": "Very high uncertainty. Be careful about drawing conclusions. Collect more data to reduce uncertainty.",
            "severity": "Warning",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#kruschke-uncertainty",
          "name": "Kruschke uncertainty (CI to ROPE ratio)",
          "unit": "ratio",
          "value": 25,
        },
      ]
    `)
  })

  it('should return no indicators for absent metricEstimates', () => {
    expect(
      Analyses.getExperimentAnalysesHealthIndicators(
        Fixtures.createExperimentFull({
          variations: [
            { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
            { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
          ],
        }),
        {
          [AnalysisStrategy.IttPure]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoCrossovers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoSpammers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoSpammersNoCrossovers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.PpNaive]: Fixtures.createAnalysis({
            metricEstimates: null,
          }),
        },
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual([])
  })

  it('should return no indicators for absent analysis', () => {
    expect(
      Analyses.getExperimentAnalysesHealthIndicators(
        Fixtures.createExperimentFull({
          variations: [
            { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
            { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
          ],
        }),
        {
          [AnalysisStrategy.IttPure]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoCrossovers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoSpammers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoSpammersNoCrossovers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.PpNaive]: undefined,
        },
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual([])
  })

  it('should throw for a missing metric assignment', () => {
    expect(() =>
      Analyses.getExperimentAnalysesHealthIndicators(
        Fixtures.createExperimentFull({
          metricAssignments: [],
          variations: [
            { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
            { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
          ],
        }),
        {
          [AnalysisStrategy.IttPure]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoCrossovers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoSpammers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.MittNoSpammersNoCrossovers]: Fixtures.createAnalysis({}),
          [AnalysisStrategy.PpNaive]: Fixtures.createAnalysis({
            metricEstimates: null,
          }),
        },
        AnalysisStrategy.PpNaive,
      ),
    ).toThrowErrorMatchingInlineSnapshot(`"Missing metricAssignment"`)
  })
})

describe('getExperimentHealthIndicators', () => {
  it('should work correctly', () => {
    expect(
      Analyses.getExperimentHealthIndicators(
        Fixtures.createExperimentFull({
          variations: [
            { variationId: 1, allocatedPercentage: 50, isDefault: true, name: 'variation_name_1' },
            { variationId: 2, allocatedPercentage: 50, isDefault: false, name: 'variation_name_2' },
          ],
        }),
      ),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "indication": Object {
            "code": "very low",
            "reason": "−∞ < x ≤ 3",
            "recommendation": "Experiments should generally run for at least a week before drawing conclusions.",
            "severity": "Warning",
          },
          "link": "https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#experiment-run-time",
          "name": "Experiment run time",
          "unit": "days",
          "value": 0,
        },
      ]
    `)
  })
})
