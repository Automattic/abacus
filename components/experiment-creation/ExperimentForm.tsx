// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import { Button, Paper, Step, StepButton, Stepper, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import React, { useRef, useState } from 'react'

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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      marginTop: theme.spacing(2),
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

  const [activeStageId, setActiveStageId] = useState<StageId>(StageId.Beginning)
  const activeStageIndex = stages.findIndex((stage) => stage.id === activeStageId)
  const changeStage = (stageId: StageId) => {
    setActiveStageId(stageId)
    if (stageFormPartRefs[stageId].current) {
      // Not sure why typescript is complaining about needing the '?'
      stageFormPartRefs[stageId].current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' })
    }
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
              <div className={classes.formPart} ref={formPartBeginningRef}>
                <Beginning />
              </div>
              <div className={classes.formPart} ref={formPartBasicInfoRef}>
                <Paper className={classes.formPaper}>
                  <BasicInfo />
                </Paper>
              </div>
              <div className={classes.formPart} ref={formPartAudienceRef}>
                <Paper className={classes.formPaper}>
                  <Typography variant='body1'>Audience Form Part</Typography>
                </Paper>
              </div>
              <div className={classes.formPart} ref={formPartMetricsRef}>
                <Paper className={classes.formPaper}>
                  <Typography variant='body1'>Metrics Form Part</Typography>
                </Paper>
              </div>
              <div className={classes.formPart} ref={formPartSubmitRef}>
                <Paper className={classes.formPaper}>
                  <Typography variant='body1' gutterBottom>
                    Paragraph about confirming a user is ready to submit. With a handy:
                  </Typography>
                  <Button type='submit' variant='contained'>
                    Submit
                  </Button>
                </Paper>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default ExperimentForm
