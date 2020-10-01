import { fetchApi } from '@/api/utils'
import { AutocompleteItem, autocompleteSchema, eventDetailsSchema } from '@/lib/schemas'
import { DataSourceResult } from '@/utils/data-loading'

export interface CompletionBag {
  userCompletionDataSource: DataSourceResult<AutocompleteItem[]>
}

async function getCompletion(name: string) {
  const autocompleteData = await fetchApi('GET', `/autocomplete/${name}`)
  return await autocompleteSchema.validate(autocompleteData, { abortEarly: false })
}

export async function getUserCompletions(): Promise<AutocompleteItem[]> {
  return (await getCompletion('users')).completions
}

export async function getEventCompletions(): Promise<AutocompleteItem[]> {
  return (await getCompletion('events')).completions
}

export function getPropCompletions(eventName: string): () => Promise<AutocompleteItem[]> {
  return async () => {
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
}
