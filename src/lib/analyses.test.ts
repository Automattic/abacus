/* eslint-disable @typescript-eslint/ban-ts-comment */
import Fixtures from 'src/test-helpers/fixtures'

import * as Analyses from './analyses'
import { AnalysisStrategy, RecommendationReason } from './schemas'

describe('getAggregateRecommendation', () => {
  it('should work correctly for single analyses', () => {
    expect(Analyses.getAggregateRecommendation([], AnalysisStrategy.PpNaive)).toEqual({
      type: Analyses.AggregateRecommendationType.NotAnalyzedYet,
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
      type: Analyses.AggregateRecommendationType.NotAnalyzedYet,
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
      type: Analyses.AggregateRecommendationType.Inconclusive,
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
      type: Analyses.AggregateRecommendationType.DeployEither,
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
      type: Analyses.AggregateRecommendationType.Deploy,
      variationId: 123,
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
      type: Analyses.AggregateRecommendationType.Deploy,
      variationId: 123,
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
          Fixtures.createAnalysis({ analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers, recommendation: null }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.Deploy,
      variationId: 123,
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
          Fixtures.createAnalysis({ analysisStrategy: AnalysisStrategy.MittNoSpammersNoCrossovers, recommendation: null }),
        ],
        AnalysisStrategy.PpNaive,
      ),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.DeployEither,
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
      type: Analyses.AggregateRecommendationType.Inconclusive,
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
      type: Analyses.AggregateRecommendationType.NotAnalyzedYet,
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
      type: Analyses.AggregateRecommendationType.ManualAnalysisRequired,
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
      type: Analyses.AggregateRecommendationType.ManualAnalysisRequired,
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
      type: Analyses.AggregateRecommendationType.ManualAnalysisRequired,
    })
  })
})
