import { DependencyList, useEffect, useState } from 'react'

export function useDataSource<Data, Deps extends DependencyList | undefined, E extends Error>(
  createDataPromise: () => Promise<Data>,
  deps: Deps,
) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<E | null>(null)
  useEffect(() => {
    setIsLoading(true)
    createDataPromise()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, deps)

  return {
    data,
    isLoading,
    error,
  }
}

export function combineIsLoading(isLoadings: boolean[]) {
  return isLoadings.reduce((acc, isLoading) => acc || isLoading, false)
}
