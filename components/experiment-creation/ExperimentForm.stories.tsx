import React from 'react'

import { createNewExperiment } from '@/lib/experiments'
import * as Normalizr from '@/lib/normalizr'
import Fixtures from '@/test-helpers/fixtures'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentCreation' }

export const Form = () => (
  <ExperimentForm
    indexedMetrics={Normalizr.indexMetrics(Fixtures.createMetricBares(20))}
    indexedSegments={Normalizr.indexSegments(Fixtures.createSegments(20))}
    initialExperiment={createNewExperiment()}
  />
)
