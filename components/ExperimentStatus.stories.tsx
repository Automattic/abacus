import React from 'react'

import { Status } from '@/lib/schemas'

import ExperimentStatus from './ExperimentStatus'

export default { title: 'ExperimentsStatus' }
export const ExperimentStatusCompleted = () => <ExperimentStatus status={Status.Completed} />
export const ExperimentStatusRunning = () => <ExperimentStatus status={Status.Running} />
export const ExperimentStatusStaging = () => <ExperimentStatus status={Status.Staging} />
export const ExperimentStatusDisabled = () => <ExperimentStatus status={Status.Disabled} />
