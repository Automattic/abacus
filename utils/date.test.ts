import { formatIsoUtcOffset } from './date'

describe('utils/date.ts module', () => {
  describe('formatIsoUtcOffset', () => {
    it('should format date in ISO-8601, UTC, with an offset', () => {
      expect(formatIsoUtcOffset(new Date(Date.UTC(2020, 5, 24, 13)))).toBe('2020-06-24T13:00:00.000+00:00')
    })
  })
})
