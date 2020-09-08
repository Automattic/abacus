import { Button, Dialog, DialogActions, DialogContent, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import { ExperimentFull, Status } from '@/lib/schemas'

import LoadingButtonContainer from './LoadingButtonContainer'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {},
  }),
)

const ExperimentRunButton = ({
  experiment,
  experimentReloadRef,
}: {
  experiment: ExperimentFull | null
  experimentReloadRef: React.MutableRefObject<() => void>
}) => {
  const _classes = useStyles()

  const { enqueueSnackbar } = useSnackbar()

  const canRunExperiment = experiment && experiment.status === Status.Staging
  const [isAskingToConfirmRunExperiment, setIsAskingToConfirmRunExperiment] = useState<boolean>(false)
  const onAskToConfirmRunExperiment = () => setIsAskingToConfirmRunExperiment(true)
  const onCancelRunExperiment = () => setIsAskingToConfirmRunExperiment(false)
  const [isSubmittingRunExperiment, setIsSubmittingRunExperiment] = useState<boolean>(false)
  const onConfirmRunExperiment = async () => {
    try {
      // istanbul ignore next; Shouldn't occur
      if (!experiment) {
        throw Error('Missing experiment, this should not happen')
      }

      setIsSubmittingRunExperiment(true)
      await ExperimentsApi.changeStatus(experiment.experimentId, Status.Running)
      enqueueSnackbar('Experiment Running!', { variant: 'success' })
      experimentReloadRef.current()
      setIsAskingToConfirmRunExperiment(false)
    } catch (e) /* istanbul ignore next; Shouldn't occur */ {
      console.log(e)
      enqueueSnackbar('Oops! Something went wrong while trying to run your experiment.', { variant: 'error' })
    } finally {
      setIsSubmittingRunExperiment(false)
    }
  }

  return (
    <>
      <Tooltip title={canRunExperiment ? '' : `This experiment is ${experiment?.status}.`}>
        <span>
          <Button
            variant='outlined'
            color='secondary'
            disabled={!canRunExperiment}
            onClick={onAskToConfirmRunExperiment}
          >
            Run
          </Button>
        </span>
      </Tooltip>
      <Dialog open={isAskingToConfirmRunExperiment} aria-labelledby='confirm-run-experiment-dialog-title'>
        <DialogContent>
          <Typography variant='body1'>Are you sure you want to run this experiment?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancelRunExperiment}>Cancel</Button>
          <LoadingButtonContainer isLoading={isSubmittingRunExperiment}>
            <Button
              variant='contained'
              color='primary'
              disabled={isSubmittingRunExperiment}
              onClick={onConfirmRunExperiment}
            >
              Run
            </Button>
          </LoadingButtonContainer>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExperimentRunButton
