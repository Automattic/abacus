import MaterialTable from 'material-table'
import React from 'react'

import { Analysis, AnalysisStrategyToHuman, ExperimentFull } from '@/models'
import { createStaticTableOptions } from '@/utils/material-table'

/**
 * Render a table of participant counts based on the latest metric analyses for the given experiment.
 */
export default function ParticipantCounts({
  experiment,
  latestPrimaryMetricAnalyses,
}: {
  experiment: ExperimentFull
  latestPrimaryMetricAnalyses: Analysis[]
}) {
  const tableColumns = [
    { title: 'Strategy', render: ({ analysisStrategy }: Analysis) => AnalysisStrategyToHuman[analysisStrategy] },
    { title: 'Total', render: ({ participantStats }: Analysis) => participantStats.total },
  ]
  experiment.getSortedVariations().forEach(({ variationId, name }) => {
    tableColumns.push({
      title: name,
      render: ({ participantStats }: Analysis) => participantStats[`variation_${variationId}`] || 0,
    })
  })
  return (
    <MaterialTable
      columns={tableColumns}
      data={latestPrimaryMetricAnalyses}
      options={createStaticTableOptions(latestPrimaryMetricAnalyses.length)}
    />
  )
}
