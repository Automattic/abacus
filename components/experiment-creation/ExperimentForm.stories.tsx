import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { createNewExperiment, ExperimentFull } from '@/models'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentCreation' }

export const Form = () => (
  <ExperimentForm
    metrics={Fixtures.createMetricBares(20)}
    segments={Fixtures.createSegments(20)}
    // TODO: Fix the schema...
    initialExperiment={(createNewExperiment() as unknown) as Partial<ExperimentFull>}
  />
)
