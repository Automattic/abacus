// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import { Button, Link, Paper, Step, StepButton, StepLabel, Stepper, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import useComponentSize from '@rehooks/component-size'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as yup from 'yup'

import { indexMetrics } from '@/lib/normalizers'
import { ExperimentFullNew, experimentFullNewSchema, MetricBare, Segment } from '@/lib/schemas'

import Audience from './Audience'
import BasicInfo from './BasicInfo'
import Beginning from './Beginning'
import Metrics from './Metrics'

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
  validatableFields?: string[]
}

const stages: Stage[] = [
  {
    id: StageId.Beginning,
    title: 'Start',
    validatableFields: ['experiment.p2Url'],
  },
  {
    id: StageId.BasicInfo,
    title: 'Basic Info',
    validatableFields: [
      'experiment.name',
      'experiment.description',
      'experiment.startDatetime',
      'experiment.endDatetime',
      'experiment.ownerLogin',
    ],
  },
  {
    id: StageId.Audience,
    title: 'Audience',
    validatableFields: [
      'experiment.platform',
      'experiment.existingUsersAllowed',
      'experiment.segments',
      'experiment.variations',
    ],
  },
  {
    id: StageId.Metrics,
    title: 'Metrics',
    validatableFields: ['experiment.metrics'],
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
    form: {
      flex: 1,
      display: 'flex',
    },
    formPart: {
      flexShrink: 0,
      padding: theme.spacing(2, 1),
    },
    formPartActions: {
      maxWidth: 660,
      display: 'flex',
      justifyContent: 'flex-end',
      '& .MuiButton-root': {
        marginLeft: theme.spacing(2),
      },
    },
    paper: {
      maxWidth: 660,
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

  const rootRef = useRef<HTMLDivElement>(null)

  const [currentStageId, setActiveStageId] = useState<StageId>(StageId.Beginning)
  const currentStageIndex = stages.findIndex((stage) => stage.id === currentStageId)

  const [completeStages, setCompleteStages] = useState<StageId[]>([])
  const markStageComplete = (stageId: StageId) => {
    setCompleteStages((prevValue) => {
      return prevValue.includes(stageId) ? prevValue : [...prevValue, stageId]
    })
  }
  const markStageIncomplete = (stageId: StageId) => {
    setCompleteStages((prevValue) => {
      return prevValue.filter((id) => id !== stageId)
    })
  }

  const [errorStages, setErrorStages] = useState<StageId[]>([])
  const markStageError = (stageId: StageId) => {
    setErrorStages((prevValue) => {
      return prevValue.includes(stageId) ? prevValue : [...prevValue, stageId]
    })
  }
  const markStageNoError = (stageId: StageId) => {
    setErrorStages((prevValue) => {
      return prevValue.filter((id) => id !== stageId)
    })
  }

  const changeStage = (stageId: StageId) => setActiveStageId(stageId)

  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
  }, [currentStageId])

  return (
    <Formik
      initialValues={{ experiment: initialExperiment }}
      onSubmit={(v) => alert(JSON.stringify(v, null, 2))}
      validationSchema={yup.object({ experiment: experimentFullNewSchema })}
    >
      {(formikProps) => {
        const isStageValid = async (stage: Stage): Promise<boolean> => {
          const errors = await formikProps.validateForm()

          // If a stage doesn't have validatable fields eg. submit we don't validate it
          if (!stage.validatableFields) {
            return false
          }

          return !!stage.validatableFields?.some((field) => _.get(errors, field))
        }

        const updateStageState = async (stage: Stage) => {
          if (await isStageValid(stage)) {
            markStageError(stage.id)
            markStageIncomplete(stage.id)
          } else {
            markStageNoError(stage.id)
            markStageComplete(stage.id)
          }
        }

        const prevStage = () => {
          if (currentStageIndex === 0) {
            return
          }

          updateStageState(stages[currentStageIndex])
          const prevStageIndex = currentStageIndex - 1
          changeStage(stages[prevStageIndex].id)
        }
        const nextStage = () => {
          if (stages.length <= currentStageIndex) {
            return
          }

          updateStageState(stages[currentStageIndex])
          const nextStageIndex = currentStageIndex + 1
          changeStage(stages[nextStageIndex].id)
        }

        const onSubmit = (event: React.SyntheticEvent<HTMLButtonElement>) => {
          event.preventDefault()
          stages.map(updateStageState)
          formikProps.handleSubmit()
        }

        return (
          <div className={classes.root}>
            <div className={classes.navigation}>
              <Stepper nonLinear activeStep={currentStageId} orientation='vertical'>
                {stages.map((stage) => (
                  <Step key={stage.id} completed={completeStages.includes(stage.id)}>
                    <StepButton onClick={() => changeStage(stage.id)}>
                      <StepLabel error={errorStages.includes(stage.id)}>{stage.title}</StepLabel>
                    </StepButton>
                  </Step>
                ))}
              </Stepper>
            </div>
            <div ref={rootRef}>
              <form className={classes.form} onSubmit={formikProps.handleSubmit} noValidate>
                {currentStageId === StageId.Beginning && (
                  <div className={classes.formPart}>
                    <Paper className={classes.paper}>
                      <Beginning />
                    </Paper>
                    <div className={classes.formPartActions}>
                      <Button onClick={nextStage} variant='contained' color='primary'>
                        Begin
                      </Button>
                    </div>
                  </div>
                )}
                {currentStageId === StageId.BasicInfo && (
                  <div className={classes.formPart}>
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
                )}
                {currentStageId === StageId.Audience && (
                  <div className={classes.formPart}>
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
                )}
                {currentStageId === StageId.Metrics && (
                  <div className={classes.formPart}>
                    <Paper className={classes.paper}>
                      <Metrics indexedMetrics={indexedMetrics} />
                    </Paper>
                    <div className={classes.formPartActions}>
                      <Button onClick={prevStage}>Previous</Button>
                      <Button onClick={nextStage} variant='contained' color='primary'>
                        Next
                      </Button>
                    </div>
                  </div>
                )}
                {currentStageId === StageId.Submit && (
                  <div className={classes.formPart}>
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
                      <Button
                        type='submit'
                        variant='contained'
                        color='secondary'
                        disabled={formikProps.isSubmitting || errorStages.length > 0}
                        onSubmit={onSubmit}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        )
      }}
    </Formik>
  )
}

export default ExperimentForm
