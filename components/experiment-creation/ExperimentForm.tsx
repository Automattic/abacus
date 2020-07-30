// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import { Button, Link, Paper, Step, StepButton, Stepper, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import useComponentSize from '@rehooks/component-size'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as yup from 'yup'

import { ExperimentFullNew, experimentFullNewSchema, MetricBare, Segment } from '@/lib/schemas'

import Audience from './Audience'
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
    },
    navigation: {
      flexShrink: 0,
      marginRight: theme.spacing(6),
      marginTop: theme.spacing(2),
    },
    formConstrictor: {
      width: '100%',
      overflow: 'hidden',
    },
    form: {
      flex: 1,
      display: 'flex',
    },
    formPart: {
      flexShrink: 0,
      padding: theme.spacing(2, 1),
    },
    formPartActions: {
      maxWidth: 600,
      display: 'flex',
      justifyContent: 'flex-end',
      '& .MuiButton-root': {
        marginLeft: theme.spacing(2),
      },
    },
    paper: {
      maxWidth: 600,
      padding: theme.spacing(3, 4),
      marginBottom: theme.spacing(2),
    },
  }),
)

const ExperimentForm = ({
  indexedMetrics,
  indexedSegments,
  initialExperiment,
}: {
  indexedMetrics: Record<number, MetricBare>
  indexedSegments: Record<number, Segment>
  initialExperiment: Partial<ExperimentFullNew>
}) => {
  const classes = useStyles()

  const constrictorRef = useRef<HTMLDivElement>(null)
  const constrictorSizes = useComponentSize(constrictorRef)

  const rootRef = useRef<HTMLDivElement>(null)
  const formPartBeginningRef = useRef<HTMLDivElement>(null)
  const formPartBasicInfoRef = useRef<HTMLDivElement>(null)
  const formPartAudienceRef = useRef<HTMLDivElement>(null)
  const formPartMetricsRef = useRef<HTMLDivElement>(null)
  const formPartSubmitRef = useRef<HTMLDivElement>(null)
  const stageFormPartRefs: Record<StageId, React.RefObject<HTMLDivElement>> = useMemo(
    () => ({
      [StageId.Beginning]: formPartBeginningRef,
      [StageId.BasicInfo]: formPartBasicInfoRef,
      [StageId.Audience]: formPartAudienceRef,
      [StageId.Metrics]: formPartMetricsRef,
      [StageId.Submit]: formPartSubmitRef,
    }),
    [],
  )

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
  const changeStage = useCallback(
    (stageId: StageId) => {
      // TODO: Update current stage error and complete state
      setActiveStageId(stageId)
      if (stageFormPartRefs[stageId].current && rootRef.current) {
        stageFormPartRefs[stageId].current?.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'start' })
      }
    },
    [stageFormPartRefs, setActiveStageId],
  )
  useEffect(() => {
    const onResize = _.debounce(() => {
      changeStage(currentStageId)
    }, 100)

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [changeStage, currentStageId])

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
    <div className={classes.root} ref={rootRef}>
      <div className={classes.navigation}>
        <Stepper nonLinear activeStep={currentStageId} orientation='vertical'>
          {stages.map((stage) => (
            <Step key={stage.id} completed={completeStages.includes(stage.id)}>
              <StepButton onClick={() => changeStage(stage.id)}>{stage.title}</StepButton>
            </Step>
          ))}
        </Stepper>
      </div>
      <div className={classes.formConstrictor} ref={constrictorRef}>
        <Formik
          initialValues={{ experiment: initialExperiment }}
          onSubmit={(v) => alert(JSON.stringify(v, null, 2))}
          validationSchema={yup.object({ experiment: experimentFullNewSchema })}
        >
          {(formikProps) => (
            <form className={classes.form} onSubmit={formikProps.handleSubmit}>
              <div className={classes.formPart} ref={formPartBeginningRef} style={{ width: constrictorSizes.width }}>
                <Paper className={classes.paper}>
                  <Beginning />
                </Paper>
                <div className={classes.formPartActions}>
                  <Button onClick={nextStage} variant='contained' color='primary'>
                    Begin
                  </Button>
                </div>
              </div>
              <div className={classes.formPart} ref={formPartBasicInfoRef} style={{ width: constrictorSizes.width }}>
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
              <div className={classes.formPart} ref={formPartAudienceRef} style={{ width: constrictorSizes.width }}>
                <Paper className={classes.paper}>
                  <Audience formikProps={formikProps} indexedSegments={indexedSegments} />
                </Paper>
                <div className={classes.formPartActions}>
                  <Button onClick={prevStage}>Previous</Button>
                  <Button onClick={nextStage} variant='contained' color='primary'>
                    Next
                  </Button>
                </div>
              </div>
              <div className={classes.formPart} ref={formPartMetricsRef} style={{ width: constrictorSizes.width }}>
                <Paper className={classes.paper}>
                  <Typography variant='h4' gutterBottom>
                    Assign Metrics
                  </Typography>
                  <Typography variant='body1'>Metrics Form Part</Typography>
                </Paper>
                <div className={classes.formPartActions}>
                  <Button onClick={prevStage}>Previous</Button>
                  <Button onClick={nextStage} variant='contained' color='primary'>
                    Next
                  </Button>
                </div>
              </div>
              <div className={classes.formPart} ref={formPartSubmitRef} style={{ width: constrictorSizes.width }}>
                <Paper className={classes.paper}>
                  <Typography variant='h4' gutterBottom>
                    Confirm and Submit Your Experiment
                  </Typography>
                  <Typography variant='body2' gutterBottom>
                    Now is a good time to{' '}
                    <Link href='https://github.com/Automattic/abacus/wiki'>
                      check our wiki&apos;s experiment creation checklist
                    </Link>{' '}
                    and confirm everything is in place.
                  </Typography>

                  <Typography variant='body2' gutterBottom>
                    Once you submit your experiment it will be set to staging, where it can be edited up until you set
                    it to running.
                  </Typography>
                  <Typography variant='body2' gutterBottom>
                    <strong> When you are ready, click the Submit button below.</strong>
                  </Typography>
                </Paper>
                <div className={classes.formPartActions}>
                  <Button onClick={prevStage}>Previous</Button>
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
