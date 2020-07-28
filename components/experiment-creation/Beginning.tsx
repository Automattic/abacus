import { Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    p2EntryField: {
      marginTop: theme.spacing(2),
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
      <Typography variant='h5' gutterBottom>
        <strong>Start by designing and documenting your experiment.</strong>
      </Typography>
      <Typography variant='body2' gutterBottom>
        Without a well documented design, an experiment could be invalid and unsafe for making important decisions.
        <br />
        <br />
        Get help from our Field Guide and enter your P2 Post&apos;s URL when you are ready:
      </Typography>
      <Field
        className={classes.p2EntryField}
        component={TextField}
        name='experiment.p2Url'
        placeholder='https://your-p2-post-here'
        variant='outlined'
      />
    </div>
  )
}

export default Beginning
