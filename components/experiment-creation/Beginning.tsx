import { Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    p2EntryField: {
      marginTop: theme.spacing(4),
      width: '100%',
      background: '#fff',
    },
    beginButton: {
      display: 'block',
      width: '10rem',
    },
  }),
)

const Beginning = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='h4' gutterBottom>
        Design and Document Your Experiment
      </Typography>
      <Typography variant='body2'>
        Without a well documented design, an experiment could be invalid and unsafe for making important decisions.
        <br />
        <br />
        <strong>Start by looking up our Field Guide, it will instruct you on creating a P2 post.</strong>
      </Typography>
      <Field
        className={classes.p2EntryField}
        component={TextField}
        name='experiment.p2Url'
        placeholder='https://your-p2-post-here'
        label={`Your Post's URL`}
        variant='outlined'
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  )
}

export default Beginning
