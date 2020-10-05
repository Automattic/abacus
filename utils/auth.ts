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
const getExperimentsAuthInfo = (localStorage: Storage): ExperimentsAuthInfo | null => {
  try {
    const experimentsAuthInfo = JSON.parse(
      localStorage.getItem('experiments_auth_info') || 'null',
    ) as ExperimentsAuthInfo | null
    if (experimentsAuthInfo?.expiresAt && experimentsAuthInfo.expiresAt > Date.now()) {
      return experimentsAuthInfo
    }
  } catch (err) {
    console.error(err)
  }
  return null
}

const getExperimentsAuthInfoFromDefaultStorage = (): ExperimentsAuthInfo | null => getExperimentsAuthInfo(localStorage)

/**
 * Saves the Experiments authorization info for later retrieval.
 *
 * @param {ExperimentsAuthInfo} experimentsAuthInfo
 * @param localStorage The localstorage implementation to use
 */
const saveExperimentsAuthInfo = (experimentsAuthInfo: ExperimentsAuthInfo | null, localStorage: Storage): void => {
  if (experimentsAuthInfo === null) {
    localStorage.removeItem('experiments_auth_info')
  } else {
    localStorage.setItem('experiments_auth_info', JSON.stringify(experimentsAuthInfo))
  }
}

const saveExperimentsAuthInfoToDefaultStorage = (experimentsAuthInfo: ExperimentsAuthInfo | null): void =>
  saveExperimentsAuthInfo(experimentsAuthInfo, localStorage)

export {
  getExperimentsAuthInfo,
  saveExperimentsAuthInfo,
  getExperimentsAuthInfoFromDefaultStorage,
  saveExperimentsAuthInfoToDefaultStorage,
}
