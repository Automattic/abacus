/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as Analyses from './analyses'

describe('getAggregateRecommendation', () => {
  it('should work correctly for single analyses', () => {
    expect(Analyses.getAggregateRecommendation([])).toEqual({
      type: Analyses.AggregateRecommendationType.NotAnalyzedYet,
    })
    // @ts-ignore
    expect(Analyses.getAggregateRecommendation([{}])).toEqual({
      type: Analyses.AggregateRecommendationType.NotAnalyzedYet,
    })
    // @ts-ignore
    expect(Analyses.getAggregateRecommendation([{ recommendation: {} }])).toEqual({
      type: Analyses.AggregateRecommendationType.Inconclusive,
    })
    // @ts-ignore
    expect(Analyses.getAggregateRecommendation([{ recommendation: { endExperiment: true } }])).toEqual({
      type: Analyses.AggregateRecommendationType.DeployEither,
    })
    expect(
      // @ts-ignore
      Analyses.getAggregateRecommendation([{ recommendation: { endExperiment: true, chosenVariationId: 123 } }]),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.Deploy,
      variationId: 123,
    })
  })

  it('should work correctly for multiple analyses without conflict', () => {
    expect(
      Analyses.getAggregateRecommendation([
        // @ts-ignore
        { recommendation: { endExperiment: true, chosenVariationId: 123 } },
        // @ts-ignore
        { recommendation: { endExperiment: true, chosenVariationId: 123 } },
      ]),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.Deploy,
      variationId: 123,
    })

    expect(
      Analyses.getAggregateRecommendation([
        // @ts-ignore
        { recommendation: { endExperiment: true, chosenVariationId: 123 } },
        // @ts-ignore
        { recommendation: {} },
      ]),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.Deploy,
      variationId: 123,
    })

    expect(
      Analyses.getAggregateRecommendation([
        // @ts-ignore
        { recommendation: { endExperiment: true, chosenVariationId: 123 } },
        // @ts-ignore
        {},
      ]),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.Deploy,
      variationId: 123,
    })

    expect(
      Analyses.getAggregateRecommendation([
        // @ts-ignore
        { recommendation: { endExperiment: true } },
        // @ts-ignore
        { recommendation: {} },
      ]),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.DeployEither,
    })

    expect(
      Analyses.getAggregateRecommendation([
        // @ts-ignore
        { recommendation: { endExperiment: true } },
        // @ts-ignore
        {},
      ]),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.DeployEither,
    })
  })
  it('should work correctly for multiple analyses with conflict', () => {
    expect(
      Analyses.getAggregateRecommendation([
        // @ts-ignore
        { recommendation: { endExperiment: true, chosenVariationId: 123 } },
        // @ts-ignore
        { recommendation: { endExperiment: true, chosenVariationId: 456 } },
      ]),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.ManualAnalysisRequired,
    })

    expect(
      Analyses.getAggregateRecommendation([
        // @ts-ignore
        { recommendation: { endExperiment: true, chosenVariationId: 123 } },
        // @ts-ignore
        { recommendation: { endExperiment: true, chosenVariationId: 456 } },
        // @ts-ignore
        { recommendation: {} },
        // @ts-ignore
        {},
      ]),
    ).toEqual({
      type: Analyses.AggregateRecommendationType.ManualAnalysisRequired,
    })
  })
})
