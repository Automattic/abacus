import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import { ExperimentFull, Status } from '@/lib/schemas'
import { useSnackbar } from 'notistack'
import ExperimentsApi from '@/api/ExperimentsApi'
import { Button, Dialog, DialogContent, Typography, DialogActions } from '@material-ui/core'
import LoadingButtonContainer from './LoadingButtonContainer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonOutlined: {
      borderColor: theme.palette.error.dark,
      color: theme.palette.error.dark,
    },
  }),
)

const ExperimentDisableButton = ({ experiment, experimentReloadRef }: { experiment: ExperimentFull | null; experimentReloadRef: React.MutableRefObject<() => void>
 }) => {
  const classes = useStyles()

  const { enqueueSnackbar } = useSnackbar()

  const canDisableExperiment = experiment && experiment.status !== Status.Disabled
  const [isAskingToConfirmDisableExperiment, setIsAskingToConfirmDisableExperiment] = useState<boolean>(false)
  const onAskToConfirmDisableExperiment = () => setIsAskingToConfirmDisableExperiment(true)
  const onCancelDisableExperiment = () => setIsAskingToConfirmDisableExperiment(false)
  const [isSubmittingDisableExperiment, setIsSubmittingDisableExperiment] = useState<boolean>(false)
  const onConfirmDisableExperiment = async () => {
    try {
      // istanbul ignore next; Shouldn't occur
      if (!experiment) {
        throw Error('Missing experiment, this should not happen')
      }

      setIsSubmittingDisableExperiment(true)
      await ExperimentsApi.changeStatus(experiment.experimentId, Status.Disabled)
      enqueueSnackbar('Experiment Disabled', { variant: 'success' })
      experimentReloadRef.current()
      setIsAskingToConfirmDisableExperiment(false)
    } catch (e) {
      // istanbul ignore next; Shouldn't occur
      console.log(e)
      enqueueSnackbar('Oops! Something went wrong while trying to disable your experiment.', { variant: 'error' })
    } finally {
      setIsSubmittingDisableExperiment(false)
    }
  }

  return (<>
    <Button
      variant='outlined'
      classes={{ outlined: classes.buttonOutlined }}
      disabled={!canDisableExperiment}
      onClick={onAskToConfirmDisableExperiment}
    >
      Disable
    </Button>
    <Dialog open={isAskingToConfirmDisableExperiment} aria-labelledby='confirm-disable-experiment-dialog-title'>
      <DialogContent>
        <Typography variant="body1">Are you sure you want to disable this experiment?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelDisableExperiment}>
          Cancel
        </Button>
        <LoadingButtonContainer isLoading={isSubmittingDisableExperiment}>
          <Button
            variant='contained'
            color='primary'
            disabled={isSubmittingDisableExperiment}
            onClick={onConfirmDisableExperiment}
          >
            Disable
          </Button>
        </LoadingButtonContainer>
      </DialogActions>
    </Dialog>
  </>)
}

export default ExperimentDisableButton
