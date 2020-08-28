import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Paper,
  Radio,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import { Field, Formik } from 'formik'
import { RadioGroup as FormikMuiRadioGroup, TextField } from 'formik-material-ui'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'

import LabelValueTable from '@/components/LabelValueTable'
import * as Experiments from '@/lib/experiments'
import { ExperimentFull } from '@/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
)

/**
 * Renders the conclusion information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the conclusion information.
 */
function ConclusionsPanel({ experiment }: { experiment: ExperimentFull }) {
  const classes = useStyles()

  const deployedVariation = Experiments.getDeployedVariation(experiment)
  const data = [
    { label: 'Reason the experiment ended', value: experiment.endReason },
    {
      label: 'Conclusion URL',
      value: !!experiment.conclusionUrl && (
        <a href={experiment.conclusionUrl} rel='noopener noreferrer' target='_blank'>
          {experiment.conclusionUrl}
        </a>
      ),
    },
    { label: 'Deployed variation', value: deployedVariation?.name },
  ]

  // Edit Modal
  const { enqueueSnackbar } = useSnackbar()
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const editInitialValues = {
    endReason: experiment.endReason ?? '',
    conclusionUrl: experiment.conclusionUrl ?? '',
    deployedVariationId: String(experiment.deployedVariationId ?? ''),
  }
  const onEdit = () => setIsEditing(true)
  const onCancelEdit = () => setIsEditing(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  const onSubmitEdit = async (formData: unknown) => {
    // TODO: Full submission
    enqueueSnackbar('Experiment Updated!', { variant: 'success' })
    setIsEditing(false)
  }

  return (
    <Paper>
      <Toolbar>
        <Typography className={classes.title} color='textPrimary' variant='h3'>
          Conclusions
        </Typography>
        <Button onClick={onEdit} variant='outlined'>
          <Edit />
          Edit
        </Button>
      </Toolbar>

      <LabelValueTable data={data} />

      <Dialog open={isEditing} fullWidth aria-labelledby='edit-experiment-conclusions-dialog-title'>
        <DialogTitle id='edit-experiment-conclusions-dialog-title'>Edit Experiment: Conclusions</DialogTitle>
        <Formik initialValues={{ experiment: editInitialValues }} onSubmit={onSubmitEdit}>
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <DialogContent>
                <div className={classes.row}>
                  <Field
                    component={TextField}
                    name='experiment.endReason'
                    id='experiment.endReason'
                    label='Reason the experiment ended'
                    placeholder='Completed successfully'
                    variant='outlined'
                    fullWidth
                    required
                    multiline
                    rows={2}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={classes.row}>
                  <Field
                    component={TextField}
                    id='experiment.conclusionUrl'
                    name='experiment.conclusionUrl'
                    placeholder='https://your-p2-post-here/#conclusion-comment'
                    label='Conclusion URL'
                    variant='outlined'
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <div className={classes.row}>
                  <FormControl component='fieldset'>
                    <FormLabel component='legend'>Deployed variation</FormLabel>
                    <Field component={FormikMuiRadioGroup} name='experiment.deployedVariationId'>
                      {experiment.variations.map((variation) => (
                        <FormControlLabel
                          key={variation.variationId}
                          value={String(variation.variationId)}
                          control={<Radio />}
                          label={variation.name}
                        />
                      ))}
                    </Field>
                  </FormControl>
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={onCancelEdit} color='primary'>
                  Cancel
                </Button>
                <Button color='primary' type='submit'>
                  Save
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Paper>
  )
}

export default ConclusionsPanel
