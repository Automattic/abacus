import { Link, Typography } from '@material-ui/core'
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

const Beginning = (): JSX.Element => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Typography variant='h4' gutterBottom>
        Design and Document Your Experiment
      </Typography>
      <Typography variant='body2'>
        We think one of the best ways to prevent a failed experiment is by documenting what you hope to learn.{/* */}
        <br />
        <br />
        <strong>
          <Link href='https://github.com/Automattic/abacus/wiki'>Our wiki is a great place to start</Link>, it will
          instruct you on creating a P2 post.
        </strong>
      </Typography>
      <Field
        className={classes.p2EntryField}
        component={TextField}
        id='experiment.p2Url'
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
