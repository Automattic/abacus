import { CircularProgress, Container, createStyles, makeStyles, Theme, Typography } from '@material-ui/core'
import debugFactory from 'debug'
import { toInt } from 'qc-to_int'
import qs from 'querystring'
import React, { useEffect, useState } from 'react'

import { saveExperimentsAuthInfo } from 'src/utils/auth'

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
 * Note: This relies upon the fact that `pages/_app.tsx` will redirect the user to
 * the OAuth authorize page.
 */
const AuthPage = function AuthPage(): JSX.Element {
  debug('AuthPage#render')
  const classes = useStyles()

  const [error, setError] = useState<null | string>(null)
  useEffect(() => {
    // This is needed because of server-side rendering
    if (typeof window === 'undefined') {
      return
    }

    if (!window.location.hash || window.location.hash.length === 0) {
      console.error('Authentication Error:', 'Missing hash in auth callback url.')
      setError(`An unknown error has occurred: Missing hash in auth callback url.`)
    }

    // If we have the hash with the authorization info, then extract the info, save
    // it for later, and go to the "home" page.
    //
    // The hash should look something like the following upon success:
    // #access_token=...&expires_in=#######&scope=global&site_id=0&token_type=bearer
    // The hash should look something like the following upon failure:
    // #error=access_denied&error_description=You+need+to+log+in+to+WordPress.com&state=
    const authInfo = qs.parse(window.location.hash.substring(1))

    const getStringFromQueryString = (str: string | string[] | undefined, def = 'unknown'): string => {
      switch (typeof str) {
        case 'undefined':
          return def
        case 'string':
          return str
        default:
          return str.join(', ')
      }
    }

    if (authInfo.error) {
      console.error('Authentication Error:', authInfo.error, authInfo.error_description)
      saveExperimentsAuthInfo(null)
      if (authInfo.error === 'access_denied') {
        setError('Please log into WordPress.com and authorize Abacus - Testing to have access.')
      } else {
        setError(
          `An unknown error has occurred. Error Code: '${getStringFromQueryString(
            authInfo.error,
          )}'. Error Desc: '${getStringFromQueryString(authInfo.error_description, 'no description')}'.`,
        )
      }
      return
    }

    if (!(authInfo.access_token && authInfo.scope === 'global' && authInfo.token_type === 'bearer')) {
      console.error('Authentication Error: Invalid AuthInfo Received:', authInfo)
      setError('An unknown error has occurred: Invalid AuthInfo Received.')
      return
    }

    const expiresInSeconds = toInt(authInfo.expires_in, 0) as unknown
    const experimentsAuthInfo = {
      accessToken: authInfo.access_token as string,
      expiresAt: typeof expiresInSeconds === 'number' ? Date.now() + expiresInSeconds * 1000 : null,
      scope: 'global',
      type: 'bearer',
    }
    saveExperimentsAuthInfo(experimentsAuthInfo)

    window.location.replace(window.location.origin)
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
