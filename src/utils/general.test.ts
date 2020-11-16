import { createIdSlug, createUnresolvingPromise, or, parseIdSlug } from './general'

describe('utils/general.ts module', () => {
  describe('createUnresolvingPromise', () => {
    it('returns a promise', () => {
      expect(createUnresolvingPromise() instanceof Promise).toBe(true)
    })
  })

  describe('or', () => {
    it('should work as expected', () => {
      expect(or(true)).toBe(true)
      expect(or(false)).toBe(false)
      expect(or(true, false)).toBe(true)
      expect(or(false, true)).toBe(true)
      expect(or(true, true)).toBe(true)
      expect(or(false, false)).toBe(false)
    })
  })

  describe('parseIdSlug', () => {
    it('should work as expected', () => {
      expect(parseIdSlug('123')).toBe(123)
      expect(parseIdSlug('0123')).toBe(123)
      expect(parseIdSlug('123-asdfasdf asdf09u23jn asdlkvjn,bmn ;p092u35')).toBe(123)
      expect(parseIdSlug('123-100000-123')).toBe(123)
      expect(parseIdSlug('1-100000-123')).toBe(1)
      expect(parseIdSlug('1x123')).toBe(1)
      expect(() => parseIdSlug('0')).toThrow(Error)
      expect(() => parseIdSlug('00000')).toThrow(Error)
      expect(() => parseIdSlug('0-100000-123')).toThrow(Error)
      expect(() => parseIdSlug('')).toThrow(Error)
      expect(() => parseIdSlug('sdfasdf')).toThrow(Error)
      expect(() => parseIdSlug('.sdfasdf')).toThrow(Error)
      expect(() => parseIdSlug('.123')).toThrow(Error)
      expect(() => parseIdSlug('-123')).toThrow(Error)
      expect(() => parseIdSlug('-123sdfasdf')).toThrow(Error)
    })
  })

  describe('createIdSlug', () => {
    it('should work as expected', () => {
      expect(createIdSlug(123, 'explat_test_experiment')).toBe('123-explat-test-experiment')
      expect(createIdSlug(123, '')).toBe('123-')
      expect(createIdSlug(0, 'explat_test_experiment')).toBe('0-explat-test-experiment')
      expect(createIdSlug(0, '')).toBe('0-')
    })
  })
})
