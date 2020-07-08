import { useSnackbar } from 'notistack'
import { useEffect } from 'react'

export function useDataLoadingError<E extends Error | null>(error: E, dataName?: string) {
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (error) {
      const userErrorMessage = dataName
        ? `Oops! There was a problem loading some data of type: ${dataName}.`
        : 'Oops! There was a problem loading some data.'
      enqueueSnackbar(userErrorMessage, { variant: 'error', persist: true })
    }
  }, [error, enqueueSnackbar, dataName])
}
