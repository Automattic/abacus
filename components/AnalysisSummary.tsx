import {Analysis, ExperimentFull} from "@/models";
import _ from "lodash";
import {formatIsoUtcOffset} from "@/utils/date";
import React from "react";

export default function AnalysisSummary(props: { analyses: Analysis[], experiment: ExperimentFull }) {
  const { analyses, experiment } = props
  if (analyses.length === 0) {
    return <h2>No analyses yet.</h2>
  }
  const sortedAnalyses = _.reverse(_.sortBy(analyses, ['analysisDatetime']))
  const latestAnalysisDatetime = sortedAnalyses[0].analysisDatetime
  const latestAnalyses = _.filter(sortedAnalyses, ['analysisDatetime', latestAnalysisDatetime])
  const metricAssignmentIds = _.map(experiment.metricAssignments, 'metricAssignmentId')
  // TODO:
  // - add participant counts according to the primary metric
  // - complain if a metric assignment doesn't have data for the latest analysis date
  // - use a nice table (Material once merged)
  // - add metric assignment values
  // - probably extract component and test
  return (
    <>
      <h2>Analysis summary for {formatIsoUtcOffset(latestAnalysisDatetime)}</h2>
      <p>{latestAnalyses.length} analyses found ({analyses.length} including historical).</p>
      <table>
        <thead>
        <tr>
          <th>Strategy</th>
          <th>Total</th>
          <th>Not final</th>
          <th>Variation split</th>
        </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
      <pre>{JSON.stringify(analyses, null, 2)}</pre>
    </>
  )
}
