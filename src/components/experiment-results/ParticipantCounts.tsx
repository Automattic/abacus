import _, { last } from 'lodash'
import MaterialTable from 'material-table'
import React from 'react'

import { AnalysisStrategyToHuman } from 'src/lib/analyses'
import { Analysis, ExperimentFull } from 'src/lib/schemas'
import * as Variations from 'src/lib/variations'
import { createStaticTableOptions } from 'src/utils/material-table'

import { MetricAssignmentAnalysesData } from './ExperimentResults'

/**
 * Render a table of participant counts based on the latest metric analyses for the given experiment.
 */
export default function ParticipantCounts({
  experiment,
  primaryMetricAssignmentAnalysesData,
}: {
  experiment: ExperimentFull
  primaryMetricAssignmentAnalysesData: MetricAssignmentAnalysesData
}): JSX.Element {
  const latestPrimaryMetricAnalyses = Object.values(primaryMetricAssignmentAnalysesData.analysesByStrategyDateAsc).map(
    last,
  ) as Analysis[]

  const tableColumns = [
    { title: 'Strategy', render: ({ analysisStrategy }: Analysis) => AnalysisStrategyToHuman[analysisStrategy] },
    { title: 'Total', render: ({ participantStats }: Analysis) => participantStats.total },
  ]

  Variations.sort(experiment.variations).forEach(({ variationId, name }) => {
    tableColumns.push({
      title: name,
      render: ({ participantStats }: Analysis) => participantStats[`variation_${variationId}`] || 0,
    })
  })

  return (
    <MaterialTable
      columns={tableColumns}
      data={_.sortBy(latestPrimaryMetricAnalyses, 'analysisStrategy')}
      options={createStaticTableOptions(latestPrimaryMetricAnalyses.length)}
    />
  )
}
