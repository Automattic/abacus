import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { createNewExperiment } from '@/lib/experiments'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentCreation' }

export const Form = () => (
  <ExperimentForm
    metrics={Fixtures.createMetricBares(20)}
    segments={Fixtures.createSegments(20)}
    initialExperiment={createNewExperiment()}
  />
)
