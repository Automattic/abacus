// Temporarily ignore until more parts are in place
/* eslint-disable @typescript-eslint/no-unused-vars */
/* istanbul ignore file */
import {
  Button,
  CircularProgress,
  Link,
  Paper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Formik } from 'formik'
import _ from 'lodash'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as yup from 'yup'

import ExperimentsApi from '@/api/ExperimentsApi'
import { createInitialExperiment } from '@/lib/experiments'
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
    validatableFields: ['experiment.metricAssignments'],
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
      maxWidth: 800,
      display: 'flex',
      justifyContent: 'flex-end',
      '& .MuiButton-root': {
        marginLeft: theme.spacing(2),
      },
    },
    paper: {
      maxWidth: 800,
      padding: theme.spacing(3, 4),
      marginBottom: theme.spacing(2),
    },
    submitContainer: {
      marginLeft: theme.spacing(2),
      '& .MuiButton-root': {
        marginLeft: 0,
      },
      position: 'relative',
    },
    submitProgress: {
      color: theme.palette.secondary.main,
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
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
  initialExperiment: ReturnType<typeof createInitialExperiment>
}) => {
  const classes = useStyles()

  const rootRef = useRef<HTMLDivElement>(null)

  const [currentStageId, setActiveStageId] = useState<StageId>(StageId.Beginning)
  const currentStageIndex = stages.findIndex((stage) => stage.id === currentStageId)

  const [completeStages, setCompleteStages] = useState<StageId[]>([])
  const [errorStages, setErrorStages] = useState<StageId[]>([])

  useEffect(() => {
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
  }, [currentStageId])

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const onSubmit = async (formData: unknown) => {
    try {
      const { experiment } = formData as { experiment: ExperimentFullNew }
      const receivedExperiment = await ExperimentsApi.create(experiment)
      enqueueSnackbar('Experiment Created!', { variant: 'success' })
      router.push(
        '/experiments/[id]/snippets?freshly_created',
        `/experiments/${receivedExperiment.experimentId}/snippets?freshly_created`,
      )
    } catch (error) {
      enqueueSnackbar('Failed to create experiment 😨 (Form data logged to console.)', { variant: 'error' })
      console.error(error)
      console.info('Form data:', formData)
    }
  }

  return (
    <Formik
      initialValues={{ experiment: initialExperiment }}
      onSubmit={onSubmit}
      validationSchema={yup.object({ experiment: experimentFullNewSchema })}
    >
      {(formikProps) => {
        const isStageValid = async (stage: Stage): Promise<boolean> => {
          const errors = await formikProps.validateForm()
          return !stage.validatableFields?.some((field) => _.get(errors, field))
        }

        const updateStageState = async (stage: Stage) => {
          if (stage.id === StageId.Submit) {
            return
          }

          if (await isStageValid(stage)) {
            setErrorStages((prevValue) => _.difference(prevValue, [stage.id]))
            setCompleteStages((prevValue) => _.union(prevValue, [stage.id]))
          } else {
            setErrorStages((prevValue) => _.union(prevValue, [stage.id]))
            setCompleteStages((prevValue) => _.difference(prevValue, [stage.id]))
          }
        }

        const changeStage = (stageId: StageId) => {
          setActiveStageId(stageId)
          updateStageState(stages[currentStageIndex])

          if (stageId === StageId.Submit) {
            stages.map(updateStageState)
          }
        }

        const prevStage = () => {
          if (0 < currentStageIndex) {
            changeStage(stages[currentStageIndex - 1].id)
          }
        }
        const nextStage = () => {
          if (currentStageIndex < stages.length) {
            changeStage(stages[currentStageIndex + 1].id)
          }
        }

        return (
          <div className={classes.root}>
            <div className={classes.navigation}>
              <Stepper nonLinear activeStep={currentStageId} orientation='vertical'>
                {stages.map((stage) => (
                  <Step key={stage.id} completed={stage.id !== currentStageId && completeStages.includes(stage.id)}>
                    <StepButton onClick={() => changeStage(stage.id)}>
                      <StepLabel error={stage.id !== currentStageId && errorStages.includes(stage.id)}>
                        {stage.title}
                      </StepLabel>
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
                        Once you submit your experiment it will be set to staging, where it can be edited up until you
                        set it to running.
                      </Typography>
                      <Typography variant='body2' gutterBottom>
                        <strong> When you are ready, click the Submit button below.</strong>
                      </Typography>
                    </Paper>
                    <div className={classes.formPartActions}>
                      <Button onClick={prevStage}>Previous</Button>
                      <div className={classes.submitContainer}>
                        <Button
                          type='submit'
                          variant='contained'
                          color='secondary'
                          disabled={formikProps.isSubmitting || errorStages.length > 0}
                        >
                          Submit
                        </Button>
                        {formikProps.isSubmitting && <CircularProgress size={24} className={classes.submitProgress} />}
                      </div>
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
