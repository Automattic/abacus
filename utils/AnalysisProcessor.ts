import _ from 'lodash'

import { Analysis, AttributionWindowSeconds, ExperimentFull, MetricBare } from '@/models'

/**
 * A summary of the latest analysis results for a specific metric assignment, containing the information we need to
 * show the results to the user.
 */
interface ResultSummary {
  metricAssignmentId: number
  attributionWindowSeconds: AttributionWindowSeconds
  metricName: string
  latestAnalyses: Analysis[]
  recommendationConflict: boolean
}

/**
 * A helper class to handle the processing of an experiment's analyses.
 */
export default class AnalysisProcessor {
  /**
   * The analyzed experiment.
   */
  public readonly experiment: ExperimentFull

  /**
   * A mapping from each of the experiment's metric assignments to its latest analyses.
   *
   * The mapped analyses are guaranteed to be ordered deterministically by analysisStrategy. Determinism is based on the
   * assumption that there's a single analysis per analysisStrategy for a given analysisDatetime.
   */
  public readonly metricAssignmentIdToLatestAnalyses: { [key: number]: Analysis[] }

  /**
   * A flat summary of the latest experiment results for display purposes. See ResultSummary for details.
   *
   * This array is guaranteed to have a deterministic order with the primary metric as the first element and the
   * remaining elements in ascending order by metricAssignmentId.
   */
  public readonly resultSummaries: ResultSummary[]

  constructor(analyses: Analysis[], experiment: ExperimentFull, metrics: MetricBare[]) {
    this.experiment = experiment
    this.metricAssignmentIdToLatestAnalyses = _.mapValues(
      _.groupBy(analyses, 'metricAssignmentId'),
      (metricAnalyses) => {
        metricAnalyses = _.orderBy(metricAnalyses, ['analysisDatetime'], ['desc'])
        return _.sortBy(
          _.filter(metricAnalyses, ['analysisDatetime', metricAnalyses[0].analysisDatetime]),
          'analysisStrategy',
        )
      },
    )

    const metricsById = _.zipObject(_.map(metrics, 'metricId'), metrics)
    this.resultSummaries = _.orderBy(
      experiment.metricAssignments,
      ['isPrimary', 'metricAssignmentId'],
      ['desc', 'asc'],
    ).map(({ metricAssignmentId, attributionWindowSeconds, metricId }) => {
      const latestAnalyses = this.metricAssignmentIdToLatestAnalyses[metricAssignmentId as number] || []
      const uniqueRecommendations = _.uniq(latestAnalyses.map(({ recommendation }) => JSON.stringify(recommendation)))
      return {
        metricAssignmentId: metricAssignmentId as number,
        attributionWindowSeconds,
        metricName: metricsById[metricId].name,
        latestAnalyses,
        recommendationConflict: uniqueRecommendations.length > 1,
      }
    })
  }

  /**
   * Return the latest analyses for the primary metric assignment from metricAssignmentIdToLatestAnalyses.
   */
  getLatestPrimaryMetricAnalyses() {
    return this.metricAssignmentIdToLatestAnalyses[this.experiment.getPrimaryMetricAssignmentId() as number]
  }
}
