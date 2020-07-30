import React from 'react'

import { createNewExperiment } from '@/lib/experiments'
import * as Normalize from '@/lib/normalize'
import Fixtures from '@/test-helpers/fixtures'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentCreation' }

export const Form = () => (
  <ExperimentForm
    indexedMetrics={Normalize.indexMetrics(Fixtures.createMetricBares(20))}
    indexedSegments={Normalize.indexSegments(Fixtures.createSegments(20))}
    initialExperiment={createNewExperiment()}
  />
)
