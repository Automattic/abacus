// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import { Button, Paper, Step, StepButton, Stepper, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { useRef, useState } from 'react'
import * as yup from 'yup'

import { experimentCreateSchema, ExperimentFull, MetricBare, Segment } from '@/lib/schemas'

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      // For WIP until I fix the rest of the layout
      height: 'calc(100vh - 110px - 43px)',
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
    formPart: {
      height: '100%',
      overflow: 'auto',
    },
    formPartActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      '& .MuiButton-root': {
        marginLeft: theme.spacing(2),
      },
    },
    // TODO: Subject to change when we get to polishing overall form UX
    paper: {
      padding: theme.spacing(2, 6),
      marginBottom: theme.spacing(2),
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

  const formPartBeginningRef = useRef<HTMLDivElement>(null)
  const formPartBasicInfoRef = useRef<HTMLDivElement>(null)
  const formPartAudienceRef = useRef<HTMLDivElement>(null)
  const formPartMetricsRef = useRef<HTMLDivElement>(null)
  const formPartSubmitRef = useRef<HTMLDivElement>(null)
  const stageFormPartRefs: Record<StageId, React.RefObject<HTMLDivElement>> = {
    [StageId.Beginning]: formPartBeginningRef,
    [StageId.BasicInfo]: formPartBasicInfoRef,
    [StageId.Audience]: formPartAudienceRef,
    [StageId.Metrics]: formPartMetricsRef,
    [StageId.Submit]: formPartSubmitRef,
  }

  const [currentStageId, setActiveStageId] = useState<StageId>(StageId.Beginning)
  const currentStageIndex = stages.findIndex((stage) => stage.id === currentStageId)
  const [completeStages, setCompleteStages] = useState<StageId[]>([])
  const markStageComplete = (stageId: StageId) => {
    completeStages.includes(currentStageId) || setCompleteStages([...completeStages, currentStageId])
  }
  const markStageIncomplete = (stageId: StageId) => {
    const index = completeStages.findIndex((stageIdCur) => stageIdCur === stageId)
    index && setCompleteStages(completeStages.splice(index, 1))
  }
  const [errorStages, setErrorStages] = useState<StageId[]>([])
  const changeStage = (stageId: StageId) => {
    // TODO: Update current stage error and complete state
    setActiveStageId(stageId)
    if (stageFormPartRefs[stageId].current) {
      // Not sure why typescript is complaining about needing the '?'
      stageFormPartRefs[stageId].current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' })
    }
  }

  const prevStage = () => {
    if (currentStageIndex === 0) {
      return
    }
    const prevStageIndex = currentStageIndex - 1

    // Just to Demo: This will actually go on changeState
    markStageIncomplete(currentStageId)
    changeStage(stages[prevStageIndex].id)
  }
  const nextStage = () => {
    if (stages.length <= currentStageIndex) {
      return
    }
    const nextStageIndex = currentStageIndex + 1

    // Just to Demo: This will actually go on changeState
    markStageComplete(currentStageId)
    changeStage(stages[nextStageIndex].id)
  }

  return (
    <div className={classes.root}>
      <div className={classes.navigation}>
        <Stepper nonLinear activeStep={currentStageId} orientation='vertical'>
          {stages.map((stage) => (
            <Step key={stage.id} completed={completeStages.includes(stage.id)}>
              <StepButton onClick={() => changeStage(stage.id)}>{stage.title}</StepButton>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className={classes.form}>
        <Formik
          initialValues={{ experiment: initialExperiment }}
          onSubmit={(v) => alert(JSON.stringify(v, null, 2))}
          validationSchema={yup.object({ experiment: experimentCreateSchema })}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className={classes.formPart} ref={formPartBeginningRef}>
                <Beginning />
                <div className={classes.formPartActions}>
                  <Button onClick={nextStage} variant='contained' color='primary'>
                    Begin
                  </Button>
                </div>
              </div>
              <div className={classes.formPart} ref={formPartBasicInfoRef}>
                <Paper className={classes.paper}>
                  <BasicInfo />
                </Paper>
                <div className={classes.formPartActions}>
                  <Button onClick={prevStage}>Previous</Button>
                  <Button onClick={nextStage} variant='contained' color='primary'>
                    Next
                  </Button>
                </div>
              </div>
              <div className={classes.formPart} ref={formPartAudienceRef}>
                <Paper className={classes.paper}>
                  <Typography variant='body1'>Audience Form Part</Typography>
                </Paper>
                <div className={classes.formPartActions}>
                  <Button onClick={prevStage}>Previous</Button>
                  <Button onClick={nextStage} variant='contained' color='primary'>
                    Next
                  </Button>
                </div>
              </div>
              <div className={classes.formPart} ref={formPartMetricsRef}>
                <Paper className={classes.paper}>
                  <Typography variant='body1'>Metrics Form Part</Typography>
                </Paper>
                <div className={classes.formPartActions}>
                  <Button onClick={prevStage}>Previous</Button>
                  <Button onClick={nextStage} variant='contained' color='primary'>
                    Next
                  </Button>
                </div>
              </div>
              <div className={classes.formPart} ref={formPartSubmitRef}>
                <Paper className={classes.paper}>
                  <Typography variant='body1' gutterBottom>
                    This last form-part gives the users a chance to pause and consider.
                    <br />
                    <br />
                    It is good to have a mini-checklist here.
                    <br />
                    <br />
                    Maybe a pre-submission summary.
                    <br />
                    <br />
                    It is also good for the users to know the consequences of submitting so they aren&apos;t afraid of
                    pressing the button.
                  </Typography>
                </Paper>
                <div className={classes.formPartActions}>
                  <Button type='submit' variant='contained' color='secondary'>
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ExperimentForm
