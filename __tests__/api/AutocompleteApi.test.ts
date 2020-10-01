/* eslint-disable @typescript-eslint/require-await */
import { getEventCompletions, getUserCompletions } from '@/api/AutocompleteApi'
import * as Utils from '@/api/utils'

jest.mock('@/api/utils')
const mockedUtils = Utils as jest.Mocked<typeof Utils>

test('it retrieves user list from the api', async () => {
  mockedUtils.fetchApi.mockImplementation(async () => ({
    completions: [
      {
        name: 'Test',
        value: 'test',
      },
    ],
  }))
  expect(await getUserCompletions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Test",
        "value": "test",
      },
    ]
  `)
})

test('it retrieves event list from the api', async () => {
  mockedUtils.fetchApi.mockImplementation(async () => ({
    completions: [
      {
        name: 'event_name',
        value: 'event_name',
      },
    ],
  }))
  expect(await getEventCompletions()).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "event_name",
        "value": "event_name",
      },
    ]
  `)
})
