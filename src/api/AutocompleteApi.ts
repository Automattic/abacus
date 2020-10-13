import { fetchApi } from 'src/api/utils'
import { AutocompleteItem, autocompleteSchema, eventDetailsSchema } from 'src/lib/schemas'
import { DataSourceResult } from 'src/utils/data-loading'

export interface CompletionBag {
  userCompletionDataSource: DataSourceResult<AutocompleteItem[]>
  eventCompletionDataSource: DataSourceResult<AutocompleteItem[]>
}

async function getCompletion(name: string) {
  return await autocompleteSchema.validate(await fetchApi('GET', `/autocomplete/${name}`), { abortEarly: false })
}

export async function getUserCompletions(): Promise<AutocompleteItem[]> {
  return (await getCompletion('users')).completions
}

export async function getEventNameCompletions(): Promise<AutocompleteItem[]> {
  return (await getCompletion('events')).completions
}

export async function getPropNameCompletions(eventName: string): Promise<AutocompleteItem[]> {
  if (eventName === '') {
    return [{ name: 'Enter an event name', value: '' }]
  }

  try {
    const apiResponse = await eventDetailsSchema.validate(await fetchApi('GET', `/autocomplete/events/${eventName}`))
    return apiResponse.props.map((p) => ({
      name: p.name,
      value: p.name,
    }))
  } catch (er) {
    return [{ name: 'No props found for this event', value: '' }]
  }
}
