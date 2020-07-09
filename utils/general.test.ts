import { createUnresolvingPromise } from './general'

describe('utils/general.ts module', () => {
  describe('createUnresolvingPromise', () => {
    it('returns a promise', () => {
      expect(createUnresolvingPromise() instanceof Promise).toBe(true)
    })
  })
})
