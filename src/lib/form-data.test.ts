import MockDate from 'mockdate'

import Fixtures from 'src/test-helpers/fixtures'

import { experimentToFormData, metricToFormData } from './form-data'

MockDate.set('2020-08-13')

describe('lib/form-data.test.ts module', () => {
  describe('experimentToFormData', () => {
    it('should return form data for a new experiment', () => {
      expect(experimentToFormData({})).toMatchInlineSnapshot(`
        Object {
          "description": "",
          "endDatetime": "",
          "existingUsersAllowed": "true",
          "exposureEvents": Array [],
          "metricAssignments": Array [],
          "name": "",
          "ownerLogin": "",
          "p2Url": "",
          "platform": "wpcom",
          "segmentAssignments": Array [],
          "startDatetime": "",
          "variations": Array [
            Object {
              "allocatedPercentage": "50",
              "isDefault": true,
              "name": "control",
            },
            Object {
              "allocatedPercentage": "50",
              "isDefault": false,
              "name": "treatment",
            },
          ],
        }
      `)
    })

    it('should return form data for an existing experiment', () => {
      const experiment = Fixtures.createExperimentFull()
      expect(experimentToFormData(experiment)).toMatchInlineSnapshot(`
        Object {
          "description": "Experiment with things. Change stuff. Profit.",
          "endDatetime": "2020-12-13",
          "existingUsersAllowed": "false",
          "exposureEvents": Array [
            Object {
              "event": "eventName",
              "props": Array [
                Object {
                  "key": "additionalProp1",
                  "value": "prop1Value",
                },
                Object {
                  "key": "additionalProp2",
                  "value": "prop2Value",
                },
                Object {
                  "key": "additionalProp3",
                  "value": "prop3Value",
                },
              ],
            },
          ],
          "metricAssignments": Array [
            Object {
              "attributionWindowSeconds": "604800",
              "changeExpected": true,
              "isPrimary": true,
              "metricId": "1",
              "minDifference": "0.1",
            },
            Object {
              "attributionWindowSeconds": "2419200",
              "changeExpected": false,
              "isPrimary": false,
              "metricId": "2",
              "minDifference": "10.5",
            },
            Object {
              "attributionWindowSeconds": "3600",
              "changeExpected": true,
              "isPrimary": false,
              "metricId": "2",
              "minDifference": "0.5",
            },
            Object {
              "attributionWindowSeconds": "21600",
              "changeExpected": true,
              "isPrimary": false,
              "metricId": "3",
              "minDifference": "12",
            },
          ],
          "name": "experiment_1",
          "ownerLogin": "test_a11n",
          "p2Url": "https://wordpress.com/experiment_1",
          "platform": "calypso",
          "segmentAssignments": Array [
            Object {
              "isExcluded": true,
              "segmentId": 1,
            },
          ],
          "startDatetime": "2020-10-13",
          "variations": Array [
            Object {
              "allocatedPercentage": "40",
              "isDefault": false,
              "name": "test",
            },
            Object {
              "allocatedPercentage": "60",
              "isDefault": true,
              "name": "control",
            },
          ],
        }
      `)
    })
  })

  describe('metricToFormData', () => {
    it('should return form data for a new metric', () => {
      expect(metricToFormData({})).toMatchInlineSnapshot(`
        Object {
          "description": "",
          "eventParams": undefined,
          "higherIsBetter": true,
          "name": "",
          "parameterType": "conversion",
          "revenueParams": undefined,
        }
      `)
    })

    it('should return form data for an existing metric', () => {
      expect(metricToFormData(Fixtures.createMetricFull(1))).toMatchInlineSnapshot(`
        Object {
          "description": "This is metric 1",
          "eventParams": "[
          {
            \\"event\\": \\"event_name\\",
            \\"props\\": {
              \\"has_blocks\\": \\"true\\"
            }
          }
        ]",
          "higherIsBetter": false,
          "name": "metric_1",
          "parameterType": "conversion",
          "revenueParams": undefined,
        }
      `)

      expect(metricToFormData(Fixtures.createMetricFull(2))).toMatchInlineSnapshot(`
        Object {
          "description": "This is metric 2",
          "eventParams": undefined,
          "higherIsBetter": false,
          "name": "metric_2",
          "parameterType": "revenue",
          "revenueParams": "{
          \\"refundDays\\": 4,
          \\"productSlugs\\": [
            \\"xx-bundles\\"
          ],
          \\"transactionTypes\\": [
            \\"new purchase\\"
          ]
        }",
        }
      `)
    })
  })
})
