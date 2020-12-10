import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Tooltip, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import ExperimentsApi from 'src/api/ExperimentsApi'
import { ExperimentFull, Status } from 'src/lib/schemas'
import { useDangerStyles } from 'src/styles/styles'

import LoadingButtonContainer from '../../general/LoadingButtonContainer'

const useStyles = makeStyles(() =>
  createStyles({
    dangerImage: {
      textAlign: 'center',
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
  const dangerClasses = useDangerStyles()

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

  const isDisablingDangerous = experiment?.status === Status.Running || experiment?.status === Status.Completed

  return (
    <>
      <Tooltip title={canDisableExperiment ? '' : 'This experiment is disabled.'}>
        <span className={className}>
          <Button
            variant='outlined'
            classes={{ outlined: dangerClasses.dangerButtonOutlined }}
            disabled={!canDisableExperiment}
            onClick={onAskToConfirmDisableExperiment}
          >
            Disable
          </Button>
        </span>
      </Tooltip>
      <Dialog
        open={isAskingToConfirmDisableExperiment}
        aria-labelledby='confirm-disable-experiment-dialog-title'
        BackdropProps={{ className: clsx(isDisablingDangerous && dangerClasses.dangerBackdrop) }}
      >
        <DialogTitle>
          <Typography variant='h5'>
            ️Are you sure you want to <strong>disable</strong> this experiment?
          </Typography>
        </DialogTitle>
        <DialogContent>
          {isDisablingDangerous && (
            <Typography variant='body2' gutterBottom>
              Disabling an experiment will <strong>trigger the default experience to all users</strong>.
            </Typography>
          )}
          <Typography variant='body2' gutterBottom>
            Disabling changes an experiment&apos;s status to disabled, which is <strong>irreversible</strong>.
          </Typography>
          {isDisablingDangerous && (
            <div className={classes.dangerImage}>
              <img src='/img/danger.gif' alt='DANGER!' />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='primary' onClick={onCancelDisableExperiment}>
            Cancel
          </Button>
          <LoadingButtonContainer isLoading={isSubmittingDisableExperiment}>
            <Button
              variant='contained'
              classes={{ contained: dangerClasses.dangerButtonContained }}
              disabled={isSubmittingDisableExperiment}
              onClick={onConfirmDisableExperiment}
            >
              Disable
            </Button>
          </LoadingButtonContainer>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ExperimentDisableButton
