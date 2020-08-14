/* eslint-disable @typescript-eslint/require-await */

import React from 'react'

import { createInitialExperiment } from '@/lib/experiments'
import * as Normalizers from '@/lib/normalizers'
import Fixtures from '@/test-helpers/fixtures'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentCreation' }

export const Form = () => (
  <ExperimentForm
    indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
    indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
    initialExperiment={createInitialExperiment()}
    onSubmit={async (formData: unknown) => alert(JSON.stringify(formData, null, 2))}
  />
)
