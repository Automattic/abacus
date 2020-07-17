// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import { Button, Paper } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'

import { experimentCreateSchema, ExperimentFull, MetricBare, Segment } from '@/lib/schemas'

import BasicInfo from './BasicInfo'
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
      <Formik
        initialValues={{ experiment: initialExperiment }}
        onSubmit={(v) => alert(JSON.stringify(v, null, 2))}
        validationSchema={yup.object({ experiment: experimentCreateSchema })}
      >
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Paper className={classes.formPart}>
              <Beginning />
            </Paper>
            <Paper className={classes.formPart}>
              <BasicInfo />
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
