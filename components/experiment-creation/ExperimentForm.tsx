// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import { Button, Paper } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React from 'react'

import { ExperimentFull, MetricBare, Segment } from '@/models'

import Beginning from './Beginning'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    // TODO: Subject to change when we get to polishing overall form UX
    formPart: {
      maxWidth: '36rem',
      padding: theme.spacing(2, 6),
      margin: theme.spacing(2, 0),
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
      <Formik initialValues={initialExperiment} onSubmit={(v) => alert(JSON.stringify(v, null, 2))}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Paper className={classes.formPart}>
              <Beginning />
            </Paper>
            <Button type='submit' variant='contained'>
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </div>
  )
}

export default ExperimentForm
