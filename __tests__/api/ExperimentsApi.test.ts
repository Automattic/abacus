import ExperimentsApi from '@/api/ExperimentsApi'
import { Platform, Status } from '@/lib/schemas'

describe('ExperimentsApi.ts module', () => {
  describe('create', () => {
    it('should create a new experiment', async () => {
      await ExperimentsApi.create({
        name: 'my_experiment',
        startDatetime: new Date(Date.UTC(2020, 4, 1)),
        endDatetime: new Date(Date.UTC(2020, 4, 4)),
        status: Status.Staging,
        platform: Platform.Wpcom,
        ownerLogin: 'wp_johnsmith',
        description: 'My first experiment.',
        existingUsersAllowed: true,
        p2Url: 'https://betterexperiments.a8c.com/2020-04-28/my-experiment',
        variations: [],
        segmentAssignments: [],
        metricAssignments: [],
      })
    })
  })

  describe('findAll', () => {
    it('should return a set of experiments with the expected experiment shape', async () => {
      await ExperimentsApi.findAll()
    })
  })

  describe('findById', () => {
    it('should return an experiment with the expected experiment shape', async () => {
      await ExperimentsApi.findById(123)
    })
  })
})
