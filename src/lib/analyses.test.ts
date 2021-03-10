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
