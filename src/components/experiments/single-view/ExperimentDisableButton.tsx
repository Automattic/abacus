import { Button, Dialog, DialogActions, DialogContent, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
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

const ExperimentDisableButton = ({
  className,
  experiment,
  experimentReloadRef,
}: {
  className?: string
  experiment: ExperimentFull | null
  experimentReloadRef: React.MutableRefObject<() => void>
}): JSX.Element => {
  const classes = useStyles()

  const { enqueueSnackbar } = useSnackbar()

  const canDisableExperiment =
    experiment && experiment.status !== Status.Disabled && experiment.name !== 'nav_unification_v2'
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
    } catch (e) /* istanbul ignore next; Shouldn't occur */ {
      console.log(e)
      enqueueSnackbar('Oops! Something went wrong while trying to disable your experiment.', { variant: 'error' })
    } finally {
      setIsSubmittingDisableExperiment(false)
    }
  }

  return (
    <>
      <Tooltip title={canDisableExperiment ? '' : 'This experiment is disabled.'}>
        <span className={className}>
          <Button
            variant='outlined'
            classes={{ outlined: classes.buttonOutlined }}
            disabled={!canDisableExperiment}
            onClick={onAskToConfirmDisableExperiment}
          >
            Disable
          </Button>
        </span>
      </Tooltip>
      <Dialog open={isAskingToConfirmDisableExperiment} aria-labelledby='confirm-disable-experiment-dialog-title'>
        <DialogContent>
          <Typography variant='h5' gutterBottom>
            ️Are you sure you want to <strong>disable this experiment</strong>?
          </Typography>
          <Typography variant='body2' gutterBottom>
            Disabling an experiment automatically triggers the default experience to our users.
          </Typography>
          <Typography variant='body2' gutterBottom>
            It also immediately stops a running experiment, which is irreversible.{' '}
          </Typography>
        </DialogContent>
        <DialogActions className={classes.actions}>
          <LoadingButtonContainer isLoading={isSubmittingDisableExperiment}>
            <Button
              variant='contained'
              classes={{ contained: classes.buttonContained }}
              disabled={isSubmittingDisableExperiment}
              onClick={onConfirmDisableExperiment}
            >
              Disable
            </Button>
          </LoadingButtonContainer>
          <Button variant='contained' color='primary' onClick={onCancelDisableExperiment}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExperimentDisableButton
