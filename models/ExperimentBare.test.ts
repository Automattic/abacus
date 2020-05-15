import { Platform } from '@/models/Platform'
import { Status } from '@/models/Status'

import { ExperimentBare } from './ExperimentBare'

describe('models/ExperimentBare.ts module', () => {
  describe('ExperimentBare', () => {
    describe('constructor', () => {
      it('called with valid API data should create a new `ExperimentBare` instance', () => {
        const experimentBare = new ExperimentBare({
          end_datetime: '2020-02-29',
          experiment_id: 123,
          name: 'Example Experiment',
          platform: 'calypso',
          owner_login: 'a12n',
          start_datetime: '2020-01-01',
          status: 'staging',
        })
        expect(experimentBare).toEqual({
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
})
