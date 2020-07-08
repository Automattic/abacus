import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

export function useDataLoadingError<E extends Error | null>(error: E, dataName?: string) {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (error) {
      const userErrorMessage = dataName
        ? `Oops! There was a problem loading some data: ${dataName}`
        : 'Oops! There was a problem loading data'
      enqueueSnackbar(userErrorMessage, { variant: 'error' })
    }
  }, [error])
}
