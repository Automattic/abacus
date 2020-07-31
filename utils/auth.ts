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

/* istanbul ignore next; TODO: e2e test authorization */
export function initializeExperimentsAuth() {
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
