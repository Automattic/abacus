import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    row: {
      margin: theme.spacing(3, 0),
      display: 'flex',
      alignItems: 'center',
      '&:first-of-type': {
        marginTop: 0,
      },
    },
  }),
)

const TagFormFields = (): JSX.Element => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.row}>
        <Field
          component={TextField}
          name='tag.namespace'
          id='tag.namespace'
          label='Tag namespace'
          placeholder='tag_namespace'
          helperText='Use snake_case.'
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
          name='tag.name'
          id='tag.name'
          label='Tag name'
          placeholder='tag_name'
          helperText='Use snake_case.'
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
          name='tag.description'
          id='tag.description'
          label='Tag description'
          placeholder='Put your Tag description here!'
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
    </>
  )
}

export default TagFormFields
