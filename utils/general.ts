// TODO: Consider using a more extensive lib like Rambda that covers these
/**
 * Coerces values to booleans and performs an `or` operation across them.
 * @param xs Any values
 */
export function or(...xs: unknown[]) {
  return xs.reduce((acc, x) => acc || !!x, false) as boolean
}

/**
 * Returns a promise that never resolves.
 * Useful as an empty data-loading data-promise.
 */
export function createUnresolvingPromise<T>() {
  return new Promise<T>(() => null)
}

const debugModeLocalStorageKey = 'abacus-debug-mode'

// istanbul ignore next; Debug only
export function isDebugMode() {
  // NextJS SSR...
  if (typeof localStorage === 'undefined') {
    return false
  }

  return localStorage.getItem(debugModeLocalStorageKey) === 'true'
}

// istanbul ignore next; Debug only
export function toggleDebugMode() {
  if (localStorage.getItem(debugModeLocalStorageKey) === 'true') {
    localStorage.removeItem(debugModeLocalStorageKey)
  } else {
    localStorage.setItem(debugModeLocalStorageKey, 'true')
  }
}
