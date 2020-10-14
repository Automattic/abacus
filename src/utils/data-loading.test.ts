/* eslint-disable @typescript-eslint/require-await,@typescript-eslint/no-misused-promises */
import { act, renderHook } from '@testing-library/react-hooks'
import * as notistack from 'notistack'

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

      expect(renderResult.result.current).toMatchObject({
        isLoading: true,
        data: null,
        error: null,
      })

      // this actually triggers a promise but needs to run synchronously.
      void act(() => {
        resolve(123)
      })

      await renderResult.waitForNextUpdate()

      expect(renderResult.result.current).toMatchObject({
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

      expect(renderResult.result.current).toMatchObject({
        isLoading: true,
        data: null,
        error: null,
      })

      // this actually triggers a promise but needs to run synchronously.
      void act(() => {
        reject(123)
      })

      await renderResult.waitForNextUpdate()

      expect(renderResult.result.current).toMatchObject({
        isLoading: false,
        data: null,
        error: 123,
      })
    })

    it('should resolve promise after unmount without logging an error', async () => {
      const originalConsoleError = console.error
      console.error = jest.fn((d) => originalConsoleError(d))

      const { resolve, promise } = createControllablePromise()

      const renderResult = renderHook(() => {
        return useDataSource(() => promise, [])
      })

      renderResult.unmount()

      // this actually triggers a promise but needs to run synchronously.
      void act(() => resolve(123))

      expect((console.error as jest.Mock).mock.calls.length).toBe(0)
      expect(renderResult.result.current.data).toBeNull()

      console.error = originalConsoleError
    })

    it('should reject promise after unmount without logging an error', async () => {
      const originalConsoleError = console.error
      console.error = jest.fn((d) => originalConsoleError(d))

      const { reject, promise } = createControllablePromise()

      const renderResult = renderHook(() => {
        return useDataSource(() => promise, [])
      })

      renderResult.unmount()

      // this actually triggers a promise but will run synchronously
      void act(() => reject(new Error('test')))

      expect((console.error as jest.Mock).mock.calls.length).toBe(0)
      expect(renderResult.result.current.error).toBeNull()

      console.error = originalConsoleError
    })

    it('should be able to reload data', async () => {
      const { promise: promise0, resolve: resolve0 } = createControllablePromise()
      let isPromise0Resolved = false
      const promise1 = promise0.then((data) => {
        isPromise0Resolved = true
        return data
      })
      const { promise: promise2, resolve: resolve2 } = createControllablePromise()

      const renderResult = renderHook(() => {
        return useDataSource(() => {
          return isPromise0Resolved ? promise2 : promise1
        }, [])
      })

      expect(renderResult.result.current).toMatchObject({
        isLoading: true,
        data: null,
        error: null,
      })

      // this triggers a promise but runs synchronously
      void act(() => {
        resolve0(123)
      })

      await renderResult.waitForNextUpdate()

      expect(renderResult.result.current).toMatchObject({
        isLoading: false,
        data: 123,
        error: null,
      })

      // this triggers a promise but runs synchronously
      void act(() => {
        renderResult.result.current.reloadRef.current()
      })

      expect(renderResult.result.current).toMatchObject({
        isLoading: true,
        data: 123,
        error: null,
      })

      // this triggers a promise but runs synchronously
      void act(() => {
        resolve2(456)
      })

      await renderResult.waitForNextUpdate()

      expect(renderResult.result.current).toMatchObject({
        isLoading: false,
        data: 456,
        error: null,
      })
    })
  })

  describe('useDataLoadingError(error)', () => {
    it('should not display any errors for an error value of null', () => {
      const originalConsoleError = console.error
      console.error = jest.fn((er) => originalConsoleError(er))

      const mockedEnqueueSnackbar = jest.fn()
      mockedNotistack.useSnackbar.mockImplementation(() => ({
        enqueueSnackbar: mockedEnqueueSnackbar,
        closeSnackbar: jest.fn(),
      }))

      renderHook(() => {
        useDataLoadingError(null)
      })

      expect(mockedEnqueueSnackbar.mock.calls.length).toBe(0)

      expect((console.error as jest.Mock).mock.calls.length).toBe(0)

      console.error = originalConsoleError
    })

    it('should display a general error for truthy error value without a specified dataName', () => {
      const originalConsoleError = console.error
      console.error = jest.fn()

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

      expect((console.error as jest.Mock).mock.calls.length).toBe(1)

      console.error = originalConsoleError
    })

    it('should display a specific error for truthy error value with a specified dataName', () => {
      const originalConsoleError = console.error
      console.error = jest.fn()

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

      expect((console.error as jest.Mock).mock.calls.length).toBe(1)

      console.error = originalConsoleError
    })
  })
})
