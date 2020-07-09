// For WIP
/* eslint-disable */
import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { MetricBare, Segment, createNewExperiment, ExperimentFull } from '@/models'
import { Formik } from 'formik'
import { Paper, Button } from '@material-ui/core'
import Beginning from './Beginning'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '--temp-stop-theme-from-being-prettiered-away': theme.palette.text,
    },
  }),
)

const ExperimentForm = ({
  metrics,
  segments,
  initialExperiment,
}: {
  metrics: MetricBare[]
  segments: Segment[]
  initialExperiment: Partial<ExperimentFull>
}) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Formik initialValues={initialExperiment as {}} onSubmit={(v) => alert(JSON.stringify(v, null, 2))}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Paper>
              <Beginning />
            </Paper>
            <Button type='submit'>Submit</Button>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default ExperimentForm
