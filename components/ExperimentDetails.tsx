import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import debugFactory from 'debug'
import React from 'react'

import AudiencePanel from '@/components/AudiencePanel'
import ConclusionsPanel from '@/components/ConclusionsPanel'
import GeneralPanel from '@/components/GeneralPanel'
import MetricAssignmentsPanel from '@/components/MetricAssignmentsPanel'
import * as Experiments from '@/lib/experiments'
import { ExperimentFullNormalized, ExperimentFullNormalizedData, MetricBare, Segment } from '@/lib/schemas'

const debug = debugFactory('abacus:components/ExperimentDetails.tsx')

/**
 * Renders the main details of an experiment.
 */
function ExperimentDetails({
  normalizedExperiment,
  normalizedExperimentData,
  indexedMetrics,
  indexedSegments,
}: {
  normalizedExperiment: ExperimentFullNormalized
  normalizedExperimentData: ExperimentFullNormalizedData
  indexedMetrics: Record<number, MetricBare>
  indexedSegments: Record<number, Segment>
}) {
  debug('ExperimentDetails#render')
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={7}>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <GeneralPanel {...{ normalizedExperiment }} />
          </Grid>
          {isMdDown && (
            <Grid item>
              <AudiencePanel {...{ normalizedExperiment, normalizedExperimentData, indexedSegments }} />
            </Grid>
          )}
          <Grid item>
            <MetricAssignmentsPanel
              metricAssignments={Object.values(normalizedExperimentData.entities.metricAssignments)}
              indexedMetrics={indexedMetrics}
            />
          </Grid>
          {Experiments.hasConclusionData(normalizedExperiment) && (
            <Grid item>
              <ConclusionsPanel {...{ normalizedExperiment, normalizedExperimentData }} />
            </Grid>
          )}
        </Grid>
      </Grid>
      {!isMdDown && (
        <Grid item lg={5}>
          <AudiencePanel {...{ normalizedExperiment, normalizedExperimentData, indexedSegments }} />
        </Grid>
      )}
    </Grid>
  )
}

export default ExperimentDetails
