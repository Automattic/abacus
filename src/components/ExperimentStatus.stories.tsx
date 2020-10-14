import React from 'react'

import { Status } from 'src/lib/schemas'

import ExperimentStatus from './ExperimentStatus'

export default { title: 'ExperimentsStatus' }
export const ExperimentStatusCompleted = (): JSX.Element => <ExperimentStatus status={Status.Completed} />
export const ExperimentStatusRunning = (): JSX.Element => <ExperimentStatus status={Status.Running} />
export const ExperimentStatusStaging = (): JSX.Element => <ExperimentStatus status={Status.Staging} />
export const ExperimentStatusDisabled = (): JSX.Element => <ExperimentStatus status={Status.Disabled} />
