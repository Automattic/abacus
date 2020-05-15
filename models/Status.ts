import capitalize from 'lodash/capitalize'

/**
 * The status of an experiment.
 */
enum Status {
  Staging = 'staging',
  Running = 'running',
  Completed = 'completed',
  Disabled = 'disabled',
}

function toStatus(input: string) {
  return Status[capitalize(input) as keyof typeof Status] || Status.Staging
}

export { Status, toStatus }
