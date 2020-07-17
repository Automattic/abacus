// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import { Button, Paper, Step, StepButton, Stepper } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { useState } from 'react'

import { ExperimentFull, MetricBare, Segment } from '@/lib/schemas'

import BasicInfo from './BasicInfo'
import Beginning from './Beginning'

enum StageId {
  Beginning,
  BasicInfo,
  Audience,
  Metrics,
  Submit,
}

interface Stage {
  id: StageId
  title: string
}

const stages: Stage[] = [
  {
    id: StageId.Beginning,
    title: 'Start',
  },
  {
    id: StageId.BasicInfo,
    title: 'Basic Info',
  },
  {
    id: StageId.Audience,
    title: 'Audience',
  },
  {
    id: StageId.Metrics,
    title: 'Metrics',
  },
  {
    id: StageId.Submit,
    title: 'Submit',
  },
]

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
      // for now
      height: '100vh',
    },
    navigation: {
      flexShrink: 0,
      marginRight: theme.spacing(6),
    },
    form: {
      flex: 1,
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
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

  const [activeStageId, setActiveStageId] = useState<StageId>(StageId.Beginning)
  const changeStage = (stageId: StageId) => {
    setActiveStageId(stageId)
  }

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <Stepper nonLinear activeStep={activeStageId} orientation='vertical'>
          {stages.map((stage) => (
            <Step key={stage.id}>
              <StepButton onClick={() => changeStage(stage.id)}>{stage.title}</StepButton>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className={classes.form}>
        <Formik initialValues={{ experiment: initialExperiment }} onSubmit={(v) => alert(JSON.stringify(v, null, 2))}>
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <FormPart>
                <Beginning />
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
