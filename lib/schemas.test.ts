import * as Schemas from './schemas'

describe('lib/schemas.ts module', () => {
  describe('experimentFullNewSchema endDatetime', () => {
    it('throws validation error if endDate is before startDate', async () => {
      expect.assertions(1)
      try {
        await Schemas.experimentFullNewSchema.validate(
          {
            startDatetime: '2020-08-02',
            endDatetime: '2020-08-01',
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.inner).toMatchInlineSnapshot(`
          Array [
            [ValidationError: name must be defined],
            [ValidationError: Start date (UTC) must be in the future.],
            [ValidationError: End date must be after start date.],
            [ValidationError: platform must be defined],
            [ValidationError: ownerLogin must be defined],
            [ValidationError: description must be defined],
            [ValidationError: existingUsersAllowed must be defined],
            [ValidationError: p2Url must be defined],
            [ValidationError: metricAssignments must be defined],
            [ValidationError: segmentAssignments must be defined],
            [ValidationError: variations must be defined],
          ]
        `)
      }
    })

    it('throws validation error if endDate is not within defined period of startDate', async () => {
      expect.assertions(1)
      try {
        await Schemas.experimentFullNewSchema.validate(
          {
            startDatetime: '2020-08-02',
            endDatetime: '2021-08-03',
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.inner).toMatchInlineSnapshot(`
          Array [
            [ValidationError: name must be defined],
            [ValidationError: Start date (UTC) must be in the future.],
            [ValidationError: End date must be within 12 months of start date.],
            [ValidationError: platform must be defined],
            [ValidationError: ownerLogin must be defined],
            [ValidationError: description must be defined],
            [ValidationError: existingUsersAllowed must be defined],
            [ValidationError: p2Url must be defined],
            [ValidationError: metricAssignments must be defined],
            [ValidationError: segmentAssignments must be defined],
            [ValidationError: variations must be defined],
          ]
        `)
      }
    })
  })
})
