import debugFactory from 'debug'
import { toInt } from 'qc-to_int'
import qs from 'querystring'
import React, { useEffect, useState } from 'react'

import { saveExperimentsAuthInfo } from '@/utils/auth'

const debug = debugFactory('abacus:pages/auth.tsx')

/**
 * The authorization page.
 *
 * Note: This relies upon the fact that `pages/_app.tsx` will redirect the user to
 * the OAuth authorize page.
 */
const AuthPage = function AuthPage() {
  debug('AuthPage#render')
  const [error, setError] = useState<null | string>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If we have the hash with the authorization info, then extract the info, save
      // it for later, and go to the "home" page.
      //
      // The hash should look something like the following upon success:
      // #access_token=...&expires_in=#######&scope=global&site_id=0&token_type=bearer
      // The hash should look something like the following upon failure:
      // #error=access_denied&error_description=You+need+to+log+in+to+WordPress.com&state=
      if (window.location.hash && window.location.hash.length > 1) {
        const authInfo = qs.parse(window.location.hash.substring(1))
        if (authInfo.access_token && authInfo.scope === 'global' && authInfo.token_type === 'bearer') {
          const expiresInSeconds = toInt(authInfo.expires_in)
          const experimentsAuthInfo = {
            accessToken: authInfo.access_token as string,
            expiresAt: typeof expiresInSeconds === 'number' ? Date.now() + expiresInSeconds * 1000 : null,
            scope: 'global',
            type: 'bearer',
          }
          saveExperimentsAuthInfo(experimentsAuthInfo)

          window.location.replace(window.location.origin)
        } else if (authInfo.error === 'access_denied') {
          setError('Please log into WordPress.com and authorize Abacus - Testing to have access.')

          saveExperimentsAuthInfo(null)
        }
      }
    }
  }, [])

  return (
    <>
      {/*
      Note: This error message will only be shown briefly as the user is automatically
      redirected to the OAuth authorize page.
      */}
      {error ? (
        <>
          <div>{error}</div>
          <div>Redirecting...</div>
          <div>TODO: Replace with nicer UI once auth foundation is in place.</div>
        </>
      ) : (
        <div>TODO: Replace with a loading component.</div>
      )}
    </>
  )
}

export default AuthPage
