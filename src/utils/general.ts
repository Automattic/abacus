import { idSchema } from 'src/lib/schemas'

// TODO: Consider using a more extensive lib like Rambda that covers these
/**
 * Coerces values to booleans and performs an `or` operation across them.
 * @param xs Any values
 */
export function or(...xs: unknown[]): boolean {
  return xs.reduce((acc, x) => acc || !!x, false) as boolean
}

/**
 * Returns a promise that never resolves.
 * Useful as an empty data-loading data-promise.
 */
export function createUnresolvingPromise<T>(): Promise<T> {
  return new Promise<T>(() => null)
}

const debugModeLocalStorageKey = 'abacus-debug-mode'

// istanbul ignore next; Debug only
export function isDebugMode(): boolean {
  return localStorage.getItem(debugModeLocalStorageKey) === 'true'
}

// istanbul ignore next; Debug only
export function toggleDebugMode(): void {
  if (localStorage.getItem(debugModeLocalStorageKey) === 'true') {
    localStorage.removeItem(debugModeLocalStorageKey)
  } else {
    localStorage.setItem(debugModeLocalStorageKey, 'true')
  }
}

/**
 * Parses an "id slug", a slug used in urls that contain an ID and a name, e.g.:
 * 46-explat-test-monthly-experiment
 *
 * The idea here is that we can use these for permalinks because even if the name changes
 * all we care about is the ID.
 *
 * @param idSlug string The idSlug
 * @returns integer The id from the id slug
 */
export function parseIdSlug(idSlug: string): number {
  const results = /^\d+/.exec(idSlug)
  const id = results && idSchema.defined().validateSync(results[0])
  if (!id) {
    throw new Error('Could not retrieve ID from idSlug.')
  }
  return id
}

/**
 * Creates an idSlug.
 *
 * @param id integer
 * @param name number
 *
 * @returns string The idSlug
 */
export function createIdSlug(id: number, name: string): string {
  return `${id}-${name.replace(/_/g, '-')}`
}
