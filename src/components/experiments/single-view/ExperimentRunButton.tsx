import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import ExperimentsApi from 'src/api/ExperimentsApi'
import { ExperimentFull, Status } from 'src/lib/schemas'

import LoadingButtonContainer from '../../general/LoadingButtonContainer'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonOutlined: {
      borderColor: theme.palette.error.dark,
      color: theme.palette.error.dark,
    },
    buttonContained: {
      background: theme.palette.error.dark,
      color: theme.palette.error.contrastText,
      '&:hover': {
        background: theme.palette.error.light,
      },
    },
    actions: {
      justifyContent: 'space-between',
    },
  }),
)

const ExperimentRunButton = ({
  experiment,
  experimentReloadRef,
}: {
  experiment: ExperimentFull | null
  experimentReloadRef: React.MutableRefObject<() => void>
}): JSX.Element => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const canRunExperiment =
    experiment && experiment.status === Status.Staging && experiment.name !== 'nav_unification_v2'
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
      <Tooltip title={canRunExperiment ? '' : `This experiment is ${experiment?.status ?? 'undefined status'}.`}>
        <span>
          <Button
            variant='outlined'
            classes={{ outlined: classes.buttonOutlined }}
            disabled={!canRunExperiment}
            onClick={onAskToConfirmRunExperiment}
          >
            Deploy
          </Button>
        </span>
      </Tooltip>
      <Dialog open={isAskingToConfirmRunExperiment} aria-labelledby='confirm-run-experiment-dialog-title'>
        <DialogContent>
          <Typography variant='h5' gutterBottom>
            Are you sure you want to <strong>deploy this experiment</strong>?
          </Typography>
          <Typography variant='body2' gutterBottom>
            Deploying automatically triggers the release of experimental code to our users.
          </Typography>
          <Typography variant='body2' gutterBottom>
            It also initiates this experiment, which is irreversible.
          </Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <LoadingButtonContainer isLoading={isSubmittingRunExperiment}>
            <Button
              variant='contained'
              classes={{ contained: classes.buttonContained }}
              disabled={isSubmittingRunExperiment}
              onClick={onConfirmRunExperiment}
            >
              Deploy
            </Button>
          </LoadingButtonContainer>
          <Button variant='contained' color='primary' onClick={onCancelRunExperiment}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExperimentRunButton
