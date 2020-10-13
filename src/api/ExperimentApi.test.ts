/* eslint-disable @typescript-eslint/require-await */
import MockDate from 'mockdate'

import ExperimentsApi from 'src/api/ExperimentsApi'
import * as Utils from 'src/api/utils'
import Fixtures from 'src/test-helpers/fixtures'
import { validationErrorDisplayer } from 'src/test-helpers/test-utils'

MockDate.set('2020-08-13')

jest.mock('src/api/utils')
const mockedUtils = Utils as jest.Mocked<typeof Utils>

describe('ExperimentsApi.ts module', () => {
  describe('assignMetric', () => {
    // NOTE: We are unit testing this one as the request it makes isn't so simple
    it('should make the right request', async () => {
      const experiment = Fixtures.createExperimentFull()
      const newMetricAssignment = Fixtures.createMetricAssignment({ metricAssignmentId: undefined })

      mockedUtils.fetchApi.mockImplementation(async () => experiment)

      await validationErrorDisplayer(ExperimentsApi.assignMetric(experiment, newMetricAssignment))
      expect(mockedUtils.fetchApi).toHaveBeenCalledTimes(1)
      expect(mockedUtils.fetchApi).toMatchInlineSnapshot(`
        [MockFunction] {
          "calls": Array [
            Array [
              "PATCH",
              "/experiments/1",
              Object {
                "metric_assignments": Array [
                  Object {
                    "attribution_window_seconds": 604800,
                    "change_expected": true,
                    "is_primary": true,
                    "metric_id": 1,
                    "min_difference": 0.1,
                  },
                  Object {
                    "attribution_window_seconds": 2419200,
                    "change_expected": false,
                    "is_primary": false,
                    "metric_id": 2,
                    "min_difference": 10.5,
                  },
                  Object {
                    "attribution_window_seconds": 3600,
                    "change_expected": true,
                    "is_primary": false,
                    "metric_id": 2,
                    "min_difference": 0.5,
                  },
                  Object {
                    "attribution_window_seconds": 21600,
                    "change_expected": true,
                    "is_primary": false,
                    "metric_id": 3,
                    "min_difference": 12,
                  },
                  Object {
                    "attribution_window_seconds": 604800,
                    "change_expected": true,
                    "is_primary": true,
                    "metric_assignment_id": undefined,
                    "metric_id": 1,
                    "min_difference": 0.1,
                  },
                ],
              },
            ],
          ],
          "results": Array [
            Object {
              "type": "return",
              "value": Promise {},
            },
          ],
        }
      `)
    })
  })
})
