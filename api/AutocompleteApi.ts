import { fetchApi } from '@/api/utils'
import { AutocompleteItem, autocompleteSchema, Autocompletions } from '@/lib/schemas'

async function getCompletion<T extends Autocompletions>(name: string) {
  const autocompleteData = await fetchApi('GET', `/autocomplete/${name}`)
  return await autocompleteSchema.validate(autocompleteData, { abortEarly: false })
}

export async function getUserCompletions(): Promise<AutocompleteItem[]> {
  return (await getCompletion('users')).completions
}
