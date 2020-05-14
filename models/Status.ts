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
  let status = Status.Staging

  if (input === 'staging') {
    status = Status.Staging
  } else if (input === 'running') {
    status = Status.Running
  } else if (input === 'completed') {
    status = Status.Completed
  } else if (input === 'disabled') {
    status = Status.Disabled
  }

  return status
}

export { Status, toStatus }
