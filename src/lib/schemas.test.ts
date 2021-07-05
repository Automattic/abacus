/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
          value: 'Hello World',
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

  describe('metricSchema params constraint', () => {
    it('should require params matching parameter type', async () => {
      expect.assertions(6)

      try {
        await Schemas.metricSchema.validate(
          {
            parameterType: Schemas.MetricParameterType.Conversion,
            eventParams: null,
            revenueParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "Event Params is required and must be valid JSON.",
            "Exactly one of eventParams or revenueParams must be defined.",
          ]
        `)
      }

      try {
        await Schemas.metricSchema.validate(
          {
            parameterType: Schemas.MetricParameterType.Revenue,
            eventParams: null,
            revenueParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "Revenue Params is required and must be valid JSON.",
            "Exactly one of eventParams or revenueParams must be defined.",
          ]
        `)
      }

      try {
        await Schemas.metricSchema.validate(
          {
            parameterType: Schemas.MetricParameterType.Conversion,
            eventParams: [],
            revenueParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
          ]
        `)
      }

      try {
        await Schemas.metricSchema.validate(
          {
            parameterType: Schemas.MetricParameterType.Revenue,
            eventParams: [],
            revenueParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be one of the following values: ",
            "Revenue Params is required and must be valid JSON.",
          ]
        `)
      }

      try {
        await Schemas.metricSchema.validate(
          {
            parameterType: Schemas.MetricParameterType.Conversion,
            eventParams: null,
            revenueParams: {},
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be one of the following values: ",
            "Event Params is required and must be valid JSON.",
          ]
        `)
      }

      try {
        await Schemas.metricSchema.validate(
          {
            parameterType: Schemas.MetricParameterType.Revenue,
            eventParams: null,
            revenueParams: {},
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
          ]
        `)
      }
    })

    it('should require exactly one params property', async () => {
      expect.assertions(4)

      try {
        await Schemas.metricSchema.validate(
          {
            eventParams: [],
            revenueParams: {},
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be one of the following values: ",
            "This field must be one of the following values: ",
            "Exactly one of eventParams or revenueParams must be defined.",
          ]
        `)
      }

      try {
        await Schemas.metricSchema.validate(
          {
            eventParams: null,
            revenueParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "Exactly one of eventParams or revenueParams must be defined.",
          ]
        `)
      }

      try {
        await Schemas.metricSchema.validate(
          {
            parameterType: Schemas.MetricParameterType.Conversion,
            eventParams: [],
            revenueParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
          ]
        `)
      }

      try {
        await Schemas.metricSchema.validate(
          {
            parameterType: Schemas.MetricParameterType.Revenue,
            revenueParams: {},
            eventParams: null,
          },
          { abortEarly: false },
        )
      } catch (e) {
        expect(e.errors).toMatchInlineSnapshot(`
          Array [
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
            "This field must be defined",
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
            [ValidationError: This field must be defined],
            [ValidationError: Start date (UTC) must be in the future.],
            [ValidationError: End date must be after start date.],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
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
            [ValidationError: This field must be defined],
            [ValidationError: Start date (UTC) must be in the future.],
            [ValidationError: End date must be within 12 months of start date.],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
            [ValidationError: This field must be defined],
          ]
        `)
      }
    })
  })

  describe('extendedNumberSchema', () => {
    it('should work as expected with normal numbers', () => {
      expect(Schemas.extendedNumberSchema.validateSync(Number.MIN_SAFE_INTEGER)).toBe(Number.MIN_SAFE_INTEGER)
      expect(Schemas.extendedNumberSchema.validateSync(-1)).toBe(-1)
      expect(Schemas.extendedNumberSchema.validateSync(0)).toBe(0)
      expect(Schemas.extendedNumberSchema.validateSync(1)).toBe(1)
      expect(Schemas.extendedNumberSchema.validateSync(Number.MIN_VALUE)).toBe(Number.MIN_VALUE)
      expect(Schemas.extendedNumberSchema.validateSync(Number.MAX_SAFE_INTEGER)).toBe(Number.MAX_SAFE_INTEGER)
    })
    it('should work as expected with number extensions', () => {
      expect(Schemas.extendedNumberSchema.validateSync(NaN)).toBe(NaN)
      expect(Schemas.extendedNumberSchema.validateSync('nan')).toBe(NaN)
      expect(Schemas.extendedNumberSchema.validateSync(Infinity)).toBe(Infinity)
      expect(Schemas.extendedNumberSchema.validateSync('inf')).toBe(Infinity)
      expect(Schemas.extendedNumberSchema.validateSync(-Infinity)).toBe(-Infinity)
      expect(Schemas.extendedNumberSchema.validateSync('-inf')).toBe(-Infinity)
    })
    it('should throw validation errors for non extended-numbers', () => {
      expect(() => Schemas.extendedNumberSchema.validateSync('')).toThrowErrorMatchingInlineSnapshot(
        `"this is not a number"`,
      )
      expect(() => Schemas.extendedNumberSchema.validateSync('asdf')).toThrowErrorMatchingInlineSnapshot(
        `"this is not a number"`,
      )
      expect(() => Schemas.extendedNumberSchema.validateSync({})).toThrowErrorMatchingInlineSnapshot(
        `"this is not a number"`,
      )
      expect(() => Schemas.extendedNumberSchema.validateSync(true)).toThrowErrorMatchingInlineSnapshot(
        `"this is not a number"`,
      )
      expect(() => Schemas.extendedNumberSchema.validateSync(false)).toThrowErrorMatchingInlineSnapshot(
        `"this is not a number"`,
      )
      expect(() => Schemas.extendedNumberSchema.validateSync(null)).toThrowErrorMatchingInlineSnapshot(
        `"this is not a number"`,
      )
    })
    it('should respect undefined', () => {
      expect(Schemas.extendedNumberSchema.validateSync(undefined)).toBe(undefined)
      expect(() => Schemas.extendedNumberSchema.defined().validateSync(undefined)).toThrowErrorMatchingInlineSnapshot(
        `"This field must be defined"`,
      )
    })
  })
})
