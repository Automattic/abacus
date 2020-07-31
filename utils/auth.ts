import { toInt } from 'qc-to_int'
import qs from 'querystring'

import { config } from '../config'

/**
 * Experiments authorization info, as returned from OAuth call. See
 * https://developer.wordpress.com/docs/oauth2/.
 */
interface ExperimentsAuthInfo {
  accessToken: string
  expiresAt: number | null
  scope: string
  type: string
}

/**
 * Returns the saved Experiments authorization info if available and has not expired.
 */
export const getExperimentsAuthInfo = (): ExperimentsAuthInfo | null => {
  try {
    const experimentsAuthInfo = JSON.parse(localStorage.getItem('experiments_auth_info') || 'null')
    if (experimentsAuthInfo && experimentsAuthInfo.expiresAt > Date.now()) {
      return experimentsAuthInfo
    }
  } catch (err) {
    /* istanbul ignore next */
    console.error(err)
  }
  return null
}

/**
 * Saves the Experiments authorization info for later retrieval.
 *
 * @param {ExperimentsAuthInfo} experimentsAuthInfo
 */
export const saveExperimentsAuthInfo = (experimentsAuthInfo: ExperimentsAuthInfo | null) => {
  if (experimentsAuthInfo === null) {
    localStorage.removeItem('experiments_auth_info')
  } else {
    localStorage.setItem('experiments_auth_info', JSON.stringify(experimentsAuthInfo))
  }
}

export /* istanbul ignore next; TODO: e2e test authorization */ function initializeExperimentsAuth() {
  // This is needed because of server-side rendering
  if (typeof window === 'undefined') {
    console.warn('InitializeExperimentAuth: Could not find `window`')
    return
  }

  if (!config.experimentApi.needsAuth) {
    console.warn('InitializeExperimentAuth: Proceeding uninitialized as needsAuth = false')
    return
  }

  const experimentsAuthInfo = getExperimentsAuthInfo()
  if (experimentsAuthInfo) {
    console.info('InitializeExperimentAuth: Found existing auth info.')
    return
  }


  console.info('InitializeExperimentAuth: Could not find existing auth info, re-authing.')
  const authQuery = {
    client_id: config.experimentApi.authClientId,
    redirect_uri: `${window.location.origin}/auth`,
    response_type: 'token',
    scope: 'global',
  }
  const authUrl = `${config.experimentApi.authPath}?${qs.stringify(authQuery)}`
  window.location.replace(authUrl)
}

export enum AuthError {
  AccessDenied,
  UnknownError,
}

export /* istanbul ignore next; TODO: e2e test authorization */ function onExperimentAuthCallbackUrl(): void | AuthError {
  if (typeof window === 'undefined') {
    console.warn('onExperimentAuthCallbackUrl: Could not find `window`')
    return
  }

  if (!window.location.hash || window.location.hash.length === 0) {
    console.error('Authentication Error:', 'Missing hash in auth callback url.')
    return AuthError.UnknownError
  }

  // If we have the hash with the authorization info, then extract the info, save
  // it for later, and go to the "home" page.
  //
  // The hash should look something like the following upon success:
  // #access_token=...&expires_in=#######&scope=global&site_id=0&token_type=bearer
  // The hash should look something like the following upon failure:
  // #error=access_denied&error_description=You+need+to+log+in+to+WordPress.com&state=
  const authInfo = qs.parse(window.location.hash.substring(1))

  if (authInfo.error) {
    console.error('Authentication Error:', authInfo.error, authInfo.error_description)
    saveExperimentsAuthInfo(null)
    switch (authInfo.error) {
      case 'access_denied': {
        return AuthError.AccessDenied
      }
      default: {
        return AuthError.UnknownError
      }
    }
  }

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
  }
}
