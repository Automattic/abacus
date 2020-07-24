import React from 'react'

import { createNewExperiment } from '@/lib/experiments'
import Fixtures from '@/test-helpers/fixtures'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentCreation' }

export const Form = () => (
  <ExperimentForm
    metrics={Fixtures.createMetricBares(20)}
    segments={Fixtures.createSegments(20)}
    initialExperiment={createNewExperiment()}
  />
)
