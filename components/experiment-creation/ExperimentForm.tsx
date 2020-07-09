// Temporarily ignore until more parts are in place
/* eslint-disable */
/* istanbul ignore file */
import React from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { MetricBare, Segment, ExperimentFull } from '@/models'
import { Formik } from 'formik'
import { Paper, Button } from '@material-ui/core'
import Beginning from './Beginning'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
  }),
)

/* istanbul-ignore next */
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
