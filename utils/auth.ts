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
const getExperimentsAuthInfo = (): ExperimentsAuthInfo | null => {
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
const saveExperimentsAuthInfo = (experimentsAuthInfo: ExperimentsAuthInfo | null) => {
  if (experimentsAuthInfo === null) {
    localStorage.removeItem('experiments_auth_info')
  } else {
    localStorage.setItem('experiments_auth_info', JSON.stringify(experimentsAuthInfo))
  }
}

export { getExperimentsAuthInfo, saveExperimentsAuthInfo }
