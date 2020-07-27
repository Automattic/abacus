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
import {
  ExperimentFull,
  ExperimentFullNormalized,
  ExperimentFullNormalizedData,
  MetricBare,
  Segment,
} from '@/lib/schemas'

const debug = debugFactory('abacus:components/ExperimentDetails.tsx')

/**
 * Renders the main details of an experiment.
 */
function ExperimentDetails({
  experiment,
  /*
  // Not yet used
  normalizedExperiment,
  normalizedExperimentData,
  */
  metrics,
  segments,
}: {
  experiment: ExperimentFull
  normalizedExperiment: ExperimentFullNormalized
  normalizedExperimentData: ExperimentFullNormalizedData
  metrics: MetricBare[]
  segments: Segment[]
}) {
  debug('ExperimentDetails#render')
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={7}>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <GeneralPanel experiment={experiment} />
          </Grid>
          {isMdDown && (
            <Grid item>
              <AudiencePanel experiment={experiment} segments={segments} />
            </Grid>
          )}
          <Grid item>
            <MetricAssignmentsPanel experiment={experiment} metrics={metrics} />
          </Grid>
          {Experiments.hasConclusionData(experiment) && (
            <Grid item>
              <ConclusionsPanel experiment={experiment} />
            </Grid>
          )}
        </Grid>
      </Grid>
      {!isMdDown && (
        <Grid item lg={5}>
          <AudiencePanel experiment={experiment} segments={segments} />
        </Grid>
      )}
    </Grid>
  )
}

export default ExperimentDetails
