import Grid from '@material-ui/core/Grid'
import { createStyles, makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import debugFactory from 'debug'
import React from 'react'

import AudiencePanel from 'src/components/experiments/single-view/overview/AudiencePanel'
import ConclusionsPanel from 'src/components/experiments/single-view/overview/ConclusionsPanel'
import GeneralPanel from 'src/components/experiments/single-view/overview/GeneralPanel'
import MetricAssignmentsPanel from 'src/components/experiments/single-view/overview/MetricAssignmentsPanel'
import { ExperimentFull, Metric, Segment, Status, TagBare } from 'src/lib/schemas'

const debug = debugFactory('abacus:components/ExperimentDetails.tsx')

const useStyles = makeStyles((theme) =>
  createStyles({
    panel: {
      marginBottom: theme.spacing(2),
    },
  }),
)

/**
 * Renders the main details of an experiment.
 */
function ExperimentDetails({
  experiment,
  metrics,
  segments,
  tags,
  experimentReloadRef,
}: {
  experiment: ExperimentFull
  metrics: Metric[]
  segments: Segment[]
  tags: TagBare[]
  experimentReloadRef: React.MutableRefObject<() => void>
}): JSX.Element {
  debug('ExperimentDetails#render')
  const classes = useStyles()
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={7}>
          <Grid container direction='column' spacing={2}>
            <Grid item>
              <GeneralPanel className={classes.panel} {...{ experiment, experimentReloadRef }} />
              {(experiment.status === Status.Completed || experiment.status === Status.Disabled) && (
                <ConclusionsPanel className={classes.panel} {...{ experiment, experimentReloadRef }} />
              )}
            </Grid>
            {isMdDown && (
              <Grid item>
                <AudiencePanel className={classes.panel} {...{ experiment, segments, tags }} />
              </Grid>
            )}
          </Grid>
        </Grid>
        {!isMdDown && (
          <Grid item lg={5}>
            <AudiencePanel className={classes.panel} {...{ experiment, segments, tags }} />
          </Grid>
        )}
      </Grid>
      <MetricAssignmentsPanel {...{ experiment, metrics, experimentReloadRef }} />
    </>
  )
}

export default ExperimentDetails
