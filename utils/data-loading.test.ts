import { renderHook } from '@testing-library/react-hooks'
import * as notistack from 'notistack'
import { act } from 'react-dom/test-utils'

import { useDataLoadingError, useDataSource } from './data-loading'

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>

function createControllablePromise() {
  let resOuter, rejOuter

  const promise = new Promise((resolve, reject) => {
    resOuter = resolve
    rejOuter = reject
  })

  return {
    resolve: (resOuter as unknown) as (...x: unknown[]) => void,
    reject: (rejOuter as unknown) as (...x: unknown[]) => void,
    promise,
  }
}

describe('utils/data-loading.ts module', () => {
  describe('useDataSource', () => {
    it('should have expected state without error', async () => {
      const { resolve, promise } = createControllablePromise()

      const renderResult = renderHook(() => {
        return useDataSource(() => promise, [])
      })

      expect(renderResult.result.current).toEqual({
        isLoading: true,
        data: null,
        error: null,
      })

      act(() => {
        resolve(123)
      })

      await renderResult.waitForNextUpdate()

      expect(renderResult.result.current).toEqual({
        isLoading: false,
        data: 123,
        error: null,
      })
    })

    it('should have expected state with error', async () => {
      const { reject, promise } = createControllablePromise()

      const renderResult = renderHook(() => {
        return useDataSource(() => promise, [])
      })

      expect(renderResult.result.current).toEqual({
        isLoading: true,
        data: null,
        error: null,
      })

      act(() => {
        reject(123)
      })

      await renderResult.waitForNextUpdate()

      expect(renderResult.result.current).toEqual({
        isLoading: false,
        data: null,
        error: 123,
      })
    })
  })

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
