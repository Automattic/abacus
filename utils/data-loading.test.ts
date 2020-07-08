import { renderHook } from '@testing-library/react-hooks'
import { act } from 'react-dom/test-utils'

import { combineIsLoading, useDataSource } from './data-loading'

function createControllablePromise() {
  let resOuter, rejOuter

  const p = new Promise((resolve, reject) => {
    resOuter = resolve
    rejOuter = reject
  })

  return {
    res: (resOuter as unknown) as (...x: unknown[]) => void,
    rej: (rejOuter as unknown) as (...x: unknown[]) => void,
    p,
  }
}

describe('utils/data-loading.ts module', () => {
  describe('useDataSource', () => {
    it('should have expected state without error', async () => {
      const { res, p } = createControllablePromise()

      const renderResult = renderHook(() => {
        return useDataSource(() => p, [])
      })

      expect(renderResult.result.current).toEqual({
        isLoading: true,
        data: null,
        error: null,
      })

      act(() => {
        res(123)
      })

      await renderResult.waitForNextUpdate()

      expect(renderResult.result.current).toEqual({
        isLoading: false,
        data: 123,
        error: null,
      })
    })

    it('should have expected state with error', async () => {
      const { rej, p } = createControllablePromise()

      const renderResult = renderHook(() => {
        return useDataSource(() => p, [])
      })

      expect(renderResult.result.current).toEqual({
        isLoading: true,
        data: null,
        error: null,
      })

      act(() => {
        rej(123)
      })

      await renderResult.waitForNextUpdate()

      expect(renderResult.result.current).toEqual({
        isLoading: false,
        data: null,
        error: 123,
      })
    })
  })

  describe('combineIsLoading', () => {
    it('should work as expected', () => {
      expect(combineIsLoading([true])).toBe(true)
      expect(combineIsLoading([false])).toBe(false)
      expect(combineIsLoading([true, false])).toBe(true)
      expect(combineIsLoading([false, true])).toBe(true)
      expect(combineIsLoading([true, true])).toBe(true)
      expect(combineIsLoading([false, false])).toBe(false)
    })
  })
})
