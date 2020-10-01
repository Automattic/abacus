/* eslint-disable @typescript-eslint/require-await */
import { getEventCompletions, getPropCompletions, getUserCompletions } from '@/api/AutocompleteApi'
import NotFoundError from '@/api/NotFoundError'
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

test('it retrieves event details from the api', async () => {
  mockedUtils.fetchApi.mockImplementation(async () => ({
    name: 'event_name',
    description: 'an event',
    owner: 'no-one',
    is_registered: true,
    is_validated: true,
    props: [
      {
        name: 'a_prop',
        description: 'a description',
      },
    ],
  }))
  expect(await getPropCompletions('event_name')()).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "a_prop",
        "value": "a_prop",
      },
    ]
  `)
})

test('an empty event name returns a useful error message', async () => {
  expect(await getPropCompletions('')()).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "Enter an event name",
        "value": "",
      },
    ]
  `)
})

test('a nonexistent event name returns a useful error message', async () => {
  mockedUtils.fetchApi.mockImplementation(async () => {
    throw new NotFoundError()
  })
  expect(await getPropCompletions('no_exist')()).toMatchInlineSnapshot(`
    Array [
      Object {
        "name": "No props found for this event",
        "value": "",
      },
    ]
  `)
})
