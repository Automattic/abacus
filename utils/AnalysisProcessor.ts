import _ from 'lodash'

import { Analysis, AttributionWindowSeconds, ExperimentFull, MetricBare } from '@/models'

// TODO: document and test
interface ResultSummary {
  metricAssignmentId: number
  attributionWindowSeconds: AttributionWindowSeconds
  metricName: string
  latestAnalyses: Analysis[]
  recommendationConflict: boolean
}

export default class AnalysisProcessor {
  public readonly metricAssignmentIdToLatestAnalyses: { [key: number]: Analysis[] }
  public readonly resultSummaries: ResultSummary[]
  public readonly manualAnalysisRequired: boolean

  constructor(
    public readonly analyses: Analysis[],
    public readonly experiment: ExperimentFull,
    public readonly metrics: MetricBare[],
  ) {
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
    let manualAnalysisRequired = false
    this.resultSummaries = _.orderBy(
      experiment.metricAssignments,
      ['isPrimary', 'metricAssignmentId'],
      ['desc', 'asc'],
    ).map(({ metricAssignmentId, attributionWindowSeconds, metricId }) => {
      const latestAnalyses = this.metricAssignmentIdToLatestAnalyses[metricAssignmentId as number]
      const recommendationConflict =
        _.uniq(latestAnalyses.map(({ recommendation }) => JSON.stringify(recommendation))).length !== 1
      manualAnalysisRequired = manualAnalysisRequired || recommendationConflict
      return {
        metricAssignmentId: metricAssignmentId as number,
        attributionWindowSeconds,
        metricName: metricsById[metricId].name,
        latestAnalyses,
        recommendationConflict,
      }
    })
    this.manualAnalysisRequired = manualAnalysisRequired
  }

  getLatestPrimaryMetricAnalyses() {
    return this.metricAssignmentIdToLatestAnalyses[this.experiment.getPrimaryMetricAssignmentId() as number]
  }
}
