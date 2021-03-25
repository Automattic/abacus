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
    ).toEqual({
      total: {
        assigned: 100,
        assignedCrossovers: 10,
        assignedSpammers: 15,
        exposed: 40,
      },
      byVariationId: {
        '1': {
          assigned: 40,
          assignedCrossovers: 5,
          assignedSpammers: 0,
          exposed: 15,
        },
        '2': {
          assigned: 70,
          assignedCrossovers: 15,
          assignedSpammers: 25,
          exposed: 25,
        },
      },
    })
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
    ).toEqual({
      total: {
        assigned: 0,
        assignedCrossovers: 0,
        assignedSpammers: 0,
        exposed: 0,
      },
      byVariationId: {
        '1': {
          assigned: 0,
          assignedCrossovers: 0,
          assignedSpammers: 0,
          exposed: 0,
        },
        '2': {
          assigned: 0,
          assignedCrossovers: 0,
          assignedSpammers: 0,
          exposed: 0,
        },
      },
    })
  })
})

describe('getExperimentHealthStats', () => {
  it('should work correctly', () => {
    expect(
      Analyses.getExperimentHealthStats(
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
    ).toEqual({
      probabilities: {
        byVariationId: {
          '1': {
            assignedDistributionMatchingAllocated: 0.000013715068445169529,
            assignedSpammersDistributionMatchingAllocated: 5.684341886080802e-14,
            exposedDistributionMatchingAllocated: 0.1538599441628321,
          },
          '2': {
            assignedDistributionMatchingAllocated: 0.43002088397534255,
            assignedSpammersDistributionMatchingAllocated: 0.5514843298025198,
            exposedDistributionMatchingAllocated: 0.03847730828420026,
          },
        },
      },
      ratios: {
        overall: {
          assignedCrossoversToAssigned: 0.3076923076923077,
          assignedSpammersToAssigned: 0.34615384615384615,
          exposedToAssigned: 0.3076923076923077,
        },
        byVariationId: {
          '1': {
            assignedCrossoversToAssigned: 0.125,
            assignedCrossoversToTotalAssignedCrossovers: 0.125,
            assignedSpammersToAssigned: 0,
            assignedSpammersToTotalAssignedSpammers: 0,
            assignedToTotalAssigned: 0.3076923076923077,
            exposedToAssigned: 0.375,
            exposedToTotalExposed: 0.375,
          },
          '2': {
            assignedCrossoversToAssigned: 0.21428571428571427,
            assignedCrossoversToTotalAssignedCrossovers: 0.375,
            assignedSpammersToAssigned: 0.35714285714285715,
            assignedSpammersToTotalAssignedSpammers: 0.5555555555555556,
            assignedToTotalAssigned: 0.5384615384615384,
            exposedToAssigned: 0.38571428571428573,
            exposedToTotalExposed: 0.675,
          },
        },
      },
    })
  })
})

describe('getExperimentHealthIndicators', () => {
  it('should work correctly', () => {
    expect(
      Analyses.getExperimentHealthIndicators(
        Analyses.getExperimentHealthStats(
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
    ).toEqual([
      {
        indication: 'ProbableIssue',
        link:
          'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#assignment-distribution-matching-allocated',
        name: 'Assignment distribution matching allocated',
        unit: 'P-Value',
        value: 0.000013715068445169529,
      },
      {
        indication: 'PossibleIssue',
        link:
          'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#exposure-event-distribution-matching-allocated-sample-ratio-mismatch',
        name: 'Exposure event distribution matching allocated',
        unit: 'P-Value',
        value: 0.03847730828420026,
      },
      {
        indication: 'ProbableIssue',
        link:
          'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#spammer-distribution-matching-allocated',
        name: 'Spammer distribution matching allocated',
        unit: 'P-Value',
        value: 5.684341886080802e-14,
      },
      {
        indication: 'ProbableIssue',
        link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-crossovers',
        name: 'Total crossovers',
        unit: 'Ratio',
        value: 0.3076923076923077,
      },
      {
        indication: 'ProbableIssue',
        link: 'https://github.com/Automattic/experimentation-platform/wiki/Experiment-Health#total-spammers',
        name: 'Total spammers',
        unit: 'Ratio',
        value: 0.34615384615384615,
      },
    ])
  })
})
