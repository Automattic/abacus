import { Status, toStatus } from './Status'

describe('models/Status.ts module', () => {
  describe('toStatus', () => {
    it('called with valid input should resolve to expected `Status` enum', () => {
      expect(toStatus('completed')).toBe(Status.Completed)
      expect(toStatus('disabled')).toBe(Status.Disabled)
      expect(toStatus('running')).toBe(Status.Running)
      expect(toStatus('staging')).toBe(Status.Staging)
    })

    it('called with invalid input should resolve to `Status.Staging`', () => {
      expect(toStatus('Staging')).toBe(Status.Staging)
      expect(toStatus('')).toBe(Status.Staging)
      expect(toStatus('wrong')).toBe(Status.Staging)
    })
  })
})
