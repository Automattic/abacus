import { Button, Typography } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Field } from 'formik'
import { TextField } from 'formik-material-ui'
import React from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: '36rem',
      // TODO: Remove, this is just for the storybook.
      margin: '2rem auto',
    },
    p2LinkLine: {
      margin: theme.spacing(6, 0),
    },
    p2Entry: {
      margin: theme.spacing(6, 0),
    },
    p2EntryField: {
      marginTop: theme.spacing(1),
      width: '100%',
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
      <Typography variant='body1'>
        We think one of the best ways to prevent a failed experiment is by documenting what you hope to learn.
      </Typography>
      <div className={classes.p2Entry}>
        <Typography variant='h6' gutterBottom>
          P2 Link
        </Typography>
        <Typography variant='body1' gutterBottom>
          Once you&apos;ve designed and documented your experiment, enter the P2 post URL:
        </Typography>
        <Field
          className={classes.p2EntryField}
          component={TextField}
          name='p2Url'
          placeholder='https://your-p2-post-here'
          variant='outlined'
        />
      </div>

      <Button className={classes.beginButton} variant='contained' color='primary' size='large'>
        Begin
      </Button>
    </div>
  )
}

export default Beginning
