import { Platform, Status } from '@/models'

import { ExperimentBare } from './ExperimentBare'

describe('models/ExperimentBare.ts module', () => {
  describe('ExperimentBare', () => {
    describe('fromApiData', () => {
      it('called with valid API data should create a new `ExperimentBare` instance', () => {
        const experimentBare = ExperimentBare.fromApiData({
          end_datetime: '2020-02-29T00:00:00.000+00:00',
          experiment_id: 123,
          name: 'Example Experiment',
          platform: 'calypso',
          owner_login: 'a12n',
          start_datetime: '2020-01-01T03:00:00.000+00:00',
          status: 'staging',
        })
        expect(experimentBare).toEqual(
          new ExperimentBare({
            endDatetime: new Date(Date.UTC(2020, 1, 29)),
            experimentId: 123,
            name: 'Example Experiment',
            platform: Platform.Calypso,
            ownerLogin: 'a12n',
            startDatetime: new Date(Date.UTC(2020, 0, 1, 3)),
            status: Status.Staging,
          }),
        )
      })
    })
  })
})
