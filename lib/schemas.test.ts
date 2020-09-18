import * as Schemas from './schemas'

describe('lib/schemas.ts module', () => {
  describe('autocomplete schema tests', () => {
    const completionObject = {
      completions: [
        {
          name: 'Santa',
          value: 'smartcookie',
        },
        {
          name: 'Snow White',
          value: 'sleepingprincess',
        },
        {
          name: 'Hello World',
        },
      ],
    }

    const eventDetailObject = {
      name: 'test_event',
      description: 'A description about a test event',
      owner: 'bob',
      is_registered: false,
      is_validated: true,
      props: [
        {
          name: 'complicated_property',
          description: 'This prop is complicated',
        },
        {
          name: 'no_description',
          description: '',
        },
      ],
    }

    it('should parse responses correctly', async () => {
      expect(await Schemas.autocompleteSchema.validate(completionObject, { abortEarly: false })).toEqual(
        completionObject,
      )
    })

    it('should parse event details correctly', async () => {
      expect(await Schemas.eventDetailsSchema.validate(eventDetailObject, { abortEarly: false })).toEqual(
        eventDetailObject,
      )
    })
  })

  describe('metricFullSchema params constraint', () => {
    it('should require exactly one params property', async () => {
      expect.assertions(4)

      try {
        await Schemas.metricFullSchema.validate(
          {
            eventParams: [],
            revenueParams: {},
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "metricId must be defined",
            "name must be defined",
            "description must be defined",
            "parameterType must be defined",
            "higherIsBetter must be defined",
            "revenueParams.refundDays must be defined",
            "revenueParams.productSlugs must be defined",
            "Exactly one of eventParams or revenueParams must be defined.",
          ]
        `)
      }

      try {
        await Schemas.metricFullSchema.validate(
          {
            eventParams: null,
            revenueParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "metricId must be defined",
            "name must be defined",
            "description must be defined",
            "parameterType must be defined",
            "higherIsBetter must be defined",
            "Exactly one of eventParams or revenueParams must be defined.",
          ]
        `)
      }

      try {
        await Schemas.metricFullSchema.validate(
          {
            eventParams: [],
            revenueParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "metricId must be defined",
            "name must be defined",
            "description must be defined",
            "parameterType must be defined",
            "higherIsBetter must be defined",
          ]
        `)
      }

      try {
        await Schemas.metricFullSchema.validate(
          {
            revenueParams: {},
            eventParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "metricId must be defined",
            "name must be defined",
            "description must be defined",
            "parameterType must be defined",
            "higherIsBetter must be defined",
            "revenueParams.refundDays must be defined",
            "revenueParams.productSlugs must be defined",
          ]
        `)
      }
    })
  })

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
