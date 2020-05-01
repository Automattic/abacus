import debugFactory from 'debug'
import { toInt } from 'qc-to_int'
import qs from 'querystring'
import React, { useEffect, useState } from 'react'

import { saveExperimentsApiAuth } from '../utils/auth'

const debug = debugFactory('abacus:pages/auth.tsx')

/**
 * The authorization page.
 */
const AuthPage = function AuthPage() {
  debug('AuthPage#render')
  const [error, setError] = useState<null | string>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // If we have the hash with the authorization info, then extract the info and
      // post it to the opener window.
      //
      // The hash should be empty when this page is initially open.
      // The hash should look something like the following upon success:
      // #access_token=...&expires_in=#######&scope=global&site_id=0&token_type=bearer
      // The hash should look something like the following upon failure:
      // #error=access_denied&error_description=You+need+to+log+in+to+WordPress.com&state=
      if (window.location.hash && window.location.hash.length > 1) {
        const authInfo = qs.parse(window.location.hash.substring(1))
        if (authInfo.access_token && authInfo.scope === 'global' && authInfo.token_type === 'bearer') {
          const expiresInSeconds = toInt(authInfo.expires_in)
          const experimentsApiAuth = {
            accessToken: authInfo.access_token as string,
            expiresAt: typeof expiresInSeconds === 'number' ? Date.now() + expiresInSeconds * 1000 : null,
            scope: 'global',
            type: 'bearer',
          }
          saveExperimentsApiAuth(experimentsApiAuth)

          window.location.assign(window.location.origin)
        } else if (authInfo.error === 'access_denied') {
          setError('Please log into WordPress.com and authorize Abacus to have access.')

          saveExperimentsApiAuth(null)
        }
      }
    }
  }, [])

  return (
    <>
      {error ? (
        <>
          <div>{error}</div>
          <div>TODO: Replace with nicer UI once auth foundation is in place.</div>
        </>
      ) : (
        <div>TODO: Replace with a loading component.</div>
      )}
    </>
  )
}

export default AuthPage
