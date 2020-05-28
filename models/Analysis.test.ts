import { Analysis, AnalysisStrategy, RecommendationReason, RecommendationWarning } from './Analysis'

describe('models/Analysis.ts module', () => {
  describe('Analysis', () => {
    describe('fromApiData', () => {
      it('with null estimates and recommendation should create a valid instance', () => {
        const analysis = Analysis.fromApiData({
          metric_assignment_id: 1,
          analysis_strategy: 'itt_pure',
          participant_stats: {
            total: 123,
            not_final: 50,
            variation_1: 100,
            variation_2: 23,
          },
          metric_estimates: null,
          recommendation: null,
          analysis_datetime: '2020-05-04',
        })
        expect(analysis).toEqual(
          new Analysis({
            metricAssignmentId: 1,
            analysisStrategy: AnalysisStrategy.IttPure,
            participantStats: {
              total: 123,
              not_final: 50,
              variation_1: 100,
              variation_2: 23,
            },
            metricEstimates: null,
            recommendation: null,
            analysisDatetime: new Date(2020, 4, 4),
          }),
        )
      })

      it('with non-null estimates and inconclusive recommendation should create a valid instance', () => {
        const analysis = Analysis.fromApiData({
          metric_assignment_id: 123,
          analysis_strategy: 'pp_naive',
          participant_stats: {
            total: 10,
            not_final: 10,
            variation_1: 5,
            variation_2: 5,
          },
          metric_estimates: {
            diff: { estimate: 0.5, bottom: 0, top: 1.0 },
            variation_1: { estimate: 0.5, bottom: 0, top: 1.0 },
            variation_2: { estimate: -0.5, bottom: -1.5, top: 1.0 },
          },
          recommendation: {
            end_experiment: false,
            chosen_variation_id: null,
            reason: 'ci_rope_partly_overlap',
            warnings: ['short_period'],
          },
          analysis_datetime: '2020-05-10',
        })
        expect(analysis).toEqual(
          new Analysis({
            metricAssignmentId: 123,
            analysisStrategy: AnalysisStrategy.PpNaive,
            participantStats: {
              total: 10,
              not_final: 10,
              variation_1: 5,
              variation_2: 5,
            },
            metricEstimates: {
              diff: { estimate: 0.5, bottom: 0, top: 1.0 },
              variation_1: { estimate: 0.5, bottom: 0, top: 1.0 },
              variation_2: { estimate: -0.5, bottom: -1.5, top: 1.0 },
            },
            recommendation: {
              endExperiment: false,
              chosenVariationId: null,
              reason: RecommendationReason.CiRopePartlyOverlap,
              warnings: [RecommendationWarning.ShortPeriod],
            },
            analysisDatetime: new Date(2020, 4, 10),
          }),
        )
      })

      it('with non-null estimates and a conclusive recommendation should create a valid instance', () => {
        const analysis = Analysis.fromApiData({
          metric_assignment_id: 123,
          analysis_strategy: 'mitt_no_crossovers',
          participant_stats: {
            total: 1000,
            not_final: 10,
            variation_1: 600,
            variation_2: 400,
          },
          metric_estimates: {
            diff: { estimate: 0.0, bottom: -0.01, top: 0.01 },
            variation_1: { estimate: 0.12, bottom: 0, top: 10.0 },
            variation_2: { estimate: -0.12, bottom: -1.123, top: 1.0 },
          },
          recommendation: {
            end_experiment: true,
            chosen_variation_id: 2,
            reason: 'ci_in_rope',
            warnings: [],
          },
          analysis_datetime: '2020-05-10',
        })
        expect(analysis).toEqual(
          new Analysis({
            metricAssignmentId: 123,
            analysisStrategy: AnalysisStrategy.MittNoCrossovers,
            participantStats: {
              total: 1000,
              not_final: 10,
              variation_1: 600,
              variation_2: 400,
            },
            metricEstimates: {
              diff: { estimate: 0.0, bottom: -0.01, top: 0.01 },
              variation_1: { estimate: 0.12, bottom: 0, top: 10.0 },
              variation_2: { estimate: -0.12, bottom: -1.123, top: 1.0 },
            },
            recommendation: {
              endExperiment: true,
              chosenVariationId: 2,
              reason: RecommendationReason.CiInRope,
              warnings: [],
            },
            analysisDatetime: new Date(2020, 4, 10),
          }),
        )
      })
    })
  })
})
