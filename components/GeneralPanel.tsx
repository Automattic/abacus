import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Edit } from '@material-ui/icons'
import * as dateFns from 'date-fns'
import { Field, Formik } from 'formik'
import { TextField } from 'formik-material-ui'
import _ from 'lodash'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import * as yup from 'yup'

import ExperimentsApi from '@/api/ExperimentsApi'
import DatetimeText from '@/components/DatetimeText'
import LabelValueTable from '@/components/LabelValueTable'
import { ExperimentFull, experimentFullSchema, Status, yupPick } from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    to: {
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    row: {
      margin: theme.spacing(5, 0),
      display: 'flex',
      alignItems: 'center',
      '&:first-of-type': {
        marginTop: theme.spacing(3),
      },
    },
    datePicker: {
      '& input:invalid': {
        // Fix the native date-picker placeholder text colour
        color: theme.palette.text.hint,
      },
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

/**
 * Renders the general information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the general information.
 */
function GeneralPanel({ experiment }: { experiment: ExperimentFull }) {
  const classes = useStyles()
  const data = [
    { label: 'Description', value: experiment.description },
    {
      label: 'P2 Link',
      value: (
        <a href={experiment.p2Url} rel='noopener noreferrer' target='_blank'>
          {experiment.p2Url}
        </a>
      ),
    },
    {
      label: 'Dates',
      value: (
        <>
          <DatetimeText datetime={experiment.startDatetime} excludeTime />
          <span className={classes.to}>to</span>
          <DatetimeText datetime={experiment.endDatetime} excludeTime />
        </>
      ),
    },
    { label: 'Owner', value: experiment.ownerLogin },
  ]

  // Edit Modal
  const { enqueueSnackbar } = useSnackbar()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const generalEditInitialExperiment = {
    ..._.pick(experiment, ['description', 'ownerLogin']),
    endDatetime: dateFns.format(experiment.endDatetime, 'yyyy-MM-dd'),
    // Needed for endDatetime validation
    startDatetime: experiment.startDatetime,
  }
  const canEditEndDate = experiment.status === Status.Running
  const generalEditValidationSchema = yupPick(experimentFullSchema, ['description', 'ownerLogin']).shape({
    ...(canEditEndDate && {
      // We need to ensure the end date is in the future
      endDatetime: ((yup.reach(experimentFullSchema, 'endDatetime') as unknown) as yup.MixedSchema).test(
        'future-end-date',
        'End date (UTC) must be in the future.',
        // We need to refer to new Date() instead of using dateFns.isFuture so MockDate works with this in the tests.
        (date) => dateFns.isBefore(new Date(), date),
      ),
    }),
  })
  const onEdit = () => setIsEditing(true)
  const onCancelEdit = () => setIsEditing(false)
  const onSubmitEdit = async (formData: { experiment: typeof generalEditInitialExperiment }) => {
    try {
      const experimentPatch = _.pick(
        formData.experiment,
        canEditEndDate ? ['description', 'ownerLogin', 'endDatetime'] : ['description', 'ownerLogin'],
      )
      await ExperimentsApi.patch(experiment.experimentId, (experimentPatch as unknown) as Partial<ExperimentFull>)
      enqueueSnackbar('Experiment Updated!', { variant: 'success' })
      setIsEditing(false)
    } catch (e) {
      // istanbul ignore next; Shouldn't occur
      enqueueSnackbar('Oops! Something went wrong while trying to update your experiment.', { variant: 'error' })
    }
  }

  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.title} color='textPrimary' variant='h3'>
          General
        </Typography>
        <Button onClick={onEdit} variant='outlined'>
          <Edit />
          Edit
        </Button>
      </Toolbar>
      <LabelValueTable data={data} />
      <Dialog open={isEditing} fullWidth aria-labelledby='edit-experiment-general-form-dialog-title'>
        <DialogTitle id='edit-experiment-general-form-dialog-title'>Edit Experiment: General</DialogTitle>
        <Formik
          initialValues={{ experiment: generalEditInitialExperiment }}
          validationSchema={yup.object({ experiment: generalEditValidationSchema })}
          onSubmit={onSubmitEdit}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit} noValidate>
              <DialogContent>
                <div className={classes.row}>
                  <Field
                    component={TextField}
                    name='experiment.description'
                    id='experiment.description'
                    label='Experiment description'
                    placeholder='Monthly vs. yearly pricing'
                    helperText='State your hypothesis.'
                    variant='outlined'
                    fullWidth
                    required
                    multiline
                    rows={4}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={classes.row}>
                  <Field
                    component={TextField}
                    className={classes.datePicker}
                    name='experiment.endDatetime'
                    id='experiment.endDatetime'
                    label='End date'
                    disabled={!canEditEndDate}
                    helperText={
                      canEditEndDate ? 'Use the UTC timezone.' : `Cannot be changed as the experiment has finished.`
                    }
                    type='date'
                    variant='outlined'
                    fullWidth
                    required
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={classes.row}>
                  <Field
                    component={TextField}
                    name='experiment.ownerLogin'
                    id='experiment.ownerLogin'
                    label='Owner'
                    placeholder='scjr'
                    helperText='Use WordPress.com username.'
                    variant='outlined'
                    fullWidth
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position='start'>@</InputAdornment>,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={onCancelEdit} color='primary'>
                  Cancel
                </Button>
                <div className={classes.submitContainer}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='secondary'
                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                  >
                    Save
                  </Button>
                  {formikProps.isSubmitting && <CircularProgress size={24} className={classes.submitProgress} />}
                </div>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Paper>
  )
}

export default GeneralPanel
