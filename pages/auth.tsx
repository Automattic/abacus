import debugFactory from 'debug'
import React, { useEffect, useState } from 'react'

import { AuthError, onExperimentAuthCallbackUrl } from '@/utils/auth'

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
    const error = onExperimentAuthCallbackUrl()
    if (error === AuthError.AccessDenied) {
      setError('Please log into WordPress.com and authorize Abacus - Testing to have access.')
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
