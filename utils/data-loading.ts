import _ from 'lodash'
import { useSnackbar } from 'notistack'
import { DependencyList, useEffect, useRef, useState } from 'react'

/**
 * Declarative data loader.
 * Takes care of data, loading, and error state.
 *
 * @param createDataPromise A function that returns a promise to the data
 * @param deps The hook dependencies for `createDataPromise`
 */
export function useDataSource<Data, Deps extends DependencyList | undefined, E extends Error>(
  createDataPromise: () => Promise<Data>,
  deps: Deps,
) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<E | null>(null)
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const reloadRef = useRef<() => void>(_.noop)

  useEffect(() => {
    // The isSubscribed logic is necessary to prevent setStates after unmounts or dependency changes
    let isSubscribed = true
    // For isSubscribed to work with reloading we need to use reload as a Ref
    reloadRef.current = () => {
      isSubscribed && setIsLoading(true)
      createDataPromise()
        .then((data) => isSubscribed && setData(data))
        .catch((error) => isSubscribed && setError(error))
        .finally(() => isSubscribed && setIsLoading(false))
    }
    reloadRef.current()
    return () => {
      isSubscribed = false
      // eslint-disable-next-line @typescript-eslint/unbound-method
      reloadRef.current = _.noop
    }
    // Dep checking here is not needed as we are using the additionalHooks option to check useDataSource
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return {
    data,
    isLoading,
    error,
    reloadRef,
  }
}

/**
 * Declaratively handles data loading errors.
 *
 * @param error
 * @param dataName (Optional) Name of the data to be included in the message
 */
export function useDataLoadingError<E extends Error | null>(error: E, dataName?: string) {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (error) {
      console.error('DataLoadingError', dataName, error)
      const userErrorMessage = dataName
        ? `Oops! There was a problem loading some data of type: ${dataName}.`
        : 'Oops! There was a problem loading some data.'
      enqueueSnackbar(userErrorMessage, { variant: 'error', persist: true })
    }
  }, [error, enqueueSnackbar, dataName])
}
