import Button from '@material-ui/core/Button'
import Icon from '@material-ui/core/Icon'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import clsx from 'clsx'
import React from 'react'

import ExperimentTabs from '@/components/ExperimentTabs'
import { ExperimentFull, Status } from '@/models'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    disableButton: {
      color: theme.palette.error.main,
    },
    marginLeft: {
      marginLeft: theme.spacing(2),
    },
    root: {
      alignItems: 'center',
      display: 'flex',
    },
    tabs: {
      flex: '1 0 auto',
    },
    toolbarRoot: {
      justifyContent: 'flex-end',
      minHeight: 48,
    },
    // Note: The `xs` breakpoint is too late to switch to column flex layout. The
    // `sm` breakpoint is way too soon to switch. So, picked a value somewhere in
    // between. The toolbar is widest when both the "Disable" and "Add Conclusions"
    // buttons are displayed.
    [theme.breakpoints.down(640)]: {
      root: {
        flexDirection: 'column',
      },
      tabs: {
        alignSelf: 'flex-start',
        flex: '1 0 auto',
      },
      toolbarRoot: {
        alignSelf: 'flex-end',
      },
    },
  }),
)

export type ExperimentToolbarMode = 'conclude' | 'disable' | 'edit' | 'view'
export type ExperimentToolbarSection = 'details' | 'results' | 'snippets'

/* istanbul ignore next; not concerned whether this is called or not */
const noOp = () => undefined

/**
 * Renders a toolbar for an experiment.
 */
export default function ExperimentToolbar({
  experiment,
  mode,
  onCancel = noOp,
  onConclude = noOp,
  onDisable = noOp,
  onEdit = noOp,
  onSave = noOp,
  section,
}: {
  experiment: ExperimentFull
  mode: ExperimentToolbarMode
  onCancel?: () => void
  onDisable?: () => void
  onConclude?: () => void
  onEdit?: () => void
  onSave?: () => void
  section: ExperimentToolbarSection
}) {
  const classes = useStyles()
  const { status } = experiment
  const hasConclusionData = experiment.hasConclusionData()
  const concludable = (status === Status.Completed || status === Status.Disabled) && !hasConclusionData
  const editable =
    status === Status.Staging ||
    status === Status.Running ||
    ((status === Status.Completed || status === Status.Disabled) && hasConclusionData)

  return (
    <div className={classes.root}>
      <ExperimentTabs className={classes.tabs} experiment={experiment} tab={section} />
      {section === 'details' && (
        <Toolbar className={classes.toolbarRoot} disableGutters>
          {(mode === 'disable' || mode === 'view') && status !== Status.Disabled && (
            <Button
              className={clsx(classes.disableButton, classes.marginLeft)}
              disabled={mode !== 'view'}
              onClick={() => onDisable()}
              variant='outlined'
            >
              Disable
            </Button>
          )}
          {editable &&
            (mode !== 'edit' ? (
              <Button
                className={classes.marginLeft}
                disabled={mode !== 'view'}
                onClick={() => onEdit()}
                startIcon={<Icon>edit</Icon>}
                variant='outlined'
              >
                Edit
              </Button>
            ) : (
              <>
                <Button className={classes.marginLeft} onClick={() => onCancel()} variant='outlined'>
                  Cancel
                </Button>
                <Button className={classes.marginLeft} color='primary' onClick={() => onSave()} variant='contained'>
                  Update Details
                </Button>
              </>
            ))}
          {concludable &&
            (mode !== 'conclude' ? (
              <Button
                className={classes.marginLeft}
                color='primary'
                disabled={mode !== 'view'}
                onClick={() => onConclude()}
                startIcon={<Icon>add_circle_outline</Icon>}
                variant='contained'
              >
                Add Conclusions
              </Button>
            ) : (
              <>
                <Button className={classes.marginLeft} onClick={() => onCancel()} variant='outlined'>
                  Cancel
                </Button>
                <Button className={classes.marginLeft} color='primary' onClick={() => onSave()} variant='contained'>
                  Save Conclusions
                </Button>
              </>
            ))}
        </Toolbar>
      )}
    </div>
  )
}
