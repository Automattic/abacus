import { renderHook } from '@testing-library/react-hooks'
import * as notistack from 'notistack'

import { useDataLoadingError } from './data-loading'

jest.mock('notistack')

const mockedNotistack = notistack as jest.Mocked<typeof notistack>

describe('utils/data-loading.ts module', () => {
  describe('useDataLoadingError(error)', () => {
    it('should not display any errors for an error value of null', () => {
      const mockedEnqueueSnackbar = jest.fn()
      mockedNotistack.useSnackbar.mockImplementation(() => ({
        enqueueSnackbar: mockedEnqueueSnackbar,
        closeSnackbar: jest.fn(),
      }))

      renderHook(() => {
        useDataLoadingError(null)
      })

      expect(mockedEnqueueSnackbar.mock.calls.length).toBe(0)
    })

    it('should display a general error for truthy error value without a specified dataName', () => {
      const mockedEnqueueSnackbar = jest.fn()
      mockedNotistack.useSnackbar.mockImplementation(() => ({
        enqueueSnackbar: mockedEnqueueSnackbar,
        closeSnackbar: jest.fn(),
      }))

      renderHook(() => {
        useDataLoadingError(new Error())
      })

      expect(mockedEnqueueSnackbar.mock.calls.length).toBe(1)

      expect(mockedEnqueueSnackbar.mock.calls[0]).toEqual([
        'Oops! There was a problem loading some data.',
        { variant: 'error', persist: true },
      ])
    })

    it('should display a specific error for truthy error value with a specified dataName', () => {
      const mockedEnqueueSnackbar = jest.fn()
      mockedNotistack.useSnackbar.mockImplementation(() => ({
        enqueueSnackbar: mockedEnqueueSnackbar,
        closeSnackbar: jest.fn(),
      }))

      renderHook(() => {
        useDataLoadingError(new Error(), 'DataName')
      })

      expect(mockedEnqueueSnackbar.mock.calls.length).toBe(1)

      expect(mockedEnqueueSnackbar.mock.calls[0]).toEqual([
        `Oops! There was a problem loading some data of type: DataName.`,
        { variant: 'error', persist: true },
      ])
    })
  })
})
