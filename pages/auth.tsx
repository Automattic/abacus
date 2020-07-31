import { CircularProgress, Container, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'

import { AuthError, onExperimentAuthCallbackUrl } from '@/utils/auth'

const debug = debugFactory('abacus:pages/auth.tsx')

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      height: '100vh',
    },
    progress: {
      marginTop: theme.spacing(3),
    },
  }),
)

/**
 * The authorization page.
 *
 * TODO: It is better to have this at /auth-callback
 *
 * Note: This relies upon the fact that `pages/_app.tsx` will redirect the user to
 * the OAuth authorize page.
 */
const AuthPage = function AuthPage() {
  debug('AuthPage#render')
  const classes = useStyles()

  const [error, setError] = useState<null | string>(null)
  useEffect(() => {
    const error = onExperimentAuthCallbackUrl()
    switch (error) {
      case AuthError.AccessDenied: {
        setError('Please log into WordPress.com and authorize Abacus - Testing to have access.')
        break
      }
      case AuthError.UnknownError: {
        setError('An unknown error has occured. Check the console for more information.')
        break
      }
      default: {
        return
      }
    }
  }, [])

  return (
    <Container className={classes.root}>
      <Typography variant='h4' gutterBottom>
        Authorizing
      </Typography>
      {error && (
        <Typography variant='body1' gutterBottom>
          <strong>Oops! Something went wrong:</strong> {error}
        </Typography>
      )}
      <CircularProgress className={classes.progress} />
    </Container>
  )
}

export default AuthPage
