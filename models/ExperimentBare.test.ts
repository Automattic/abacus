import { Platform } from '@/models/Platform'
import { Status } from '@/models/Status'

import { fromApiDataToBare } from './ExperimentBare'

describe('models/ExperimentBare.ts module', () => {
  describe('fromApiDataToBare', () => {
    it('called with valid API data should return an object matching the `ExperimentBare` interface', () => {
      expect(
        fromApiDataToBare({
          end_datetime: '2020-02-29',
          experiment_id: 123,
          name: 'Example Experiment',
          platform: 'calypso',
          owner_login: 'a12n',
          start_datetime: '2020-01-01',
          status: 'staging',
        }),
      ).toEqual({
        endDatetime: new Date(2020, 1, 29),
        experimentId: 123,
        name: 'Example Experiment',
        platform: Platform.Calypso,
        ownerLogin: 'a12n',
        startDatetime: new Date(2020, 0, 1),
        status: Status.Staging,
      })
    })
  })
})
