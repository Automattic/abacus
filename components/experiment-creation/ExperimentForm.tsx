// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import { Button, Paper } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React from 'react'

import { ExperimentFull, MetricBare, Segment } from '@/lib/schemas'

import BasicInfo from './BasicInfo'
import Beginning from './Beginning'

const useFormPartStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
  }),
)

const FormPart = ({ children }: { children: React.ReactNode }) => {
  const classes = useFormPartStyles()
  return <div className={classes.root}>{children}</div>
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    navigation: {
      flexShrink: 0,
    },
    form: {
      flex: 1,
    },
    // TODO: Subject to change when we get to polishing overall form UX
    formPaper: {
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
      <div className={classes.navigation}></div>
      <div className={classes.form}>
        <Formik initialValues={{ experiment: initialExperiment }} onSubmit={(v) => alert(JSON.stringify(v, null, 2))}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <FormPart>
                <Paper className={classes.formPaper}>
                  <Beginning />
                </Paper>
              </FormPart>
              <FormPart>
                <Paper className={classes.formPaper}>
                  <BasicInfo />
                </Paper>
              </FormPart>
              <FormPart>
                <Button type='submit' variant='contained'>
                  Submit
                </Button>
              </FormPart>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ExperimentForm
