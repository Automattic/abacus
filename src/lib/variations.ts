import _ from 'lodash'

import { Variation } from './schemas'

/**
 * Return the experiment's variations sorted in the canonical order: Default first, then by name.
 */
export function sort(variations: Variation[]): Variation[] {
  return _.orderBy(variations, ['isDefault', 'name'], ['desc', 'asc'])
}
