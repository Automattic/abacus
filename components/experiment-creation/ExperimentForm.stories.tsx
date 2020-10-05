/* eslint-disable @typescript-eslint/require-await */

import React from 'react'

import { getUserCompletions } from '@/api/AutocompleteApi'
import { experimentToFormData } from '@/lib/form-data'
import * as Normalizers from '@/lib/normalizers'
import { Platform, Status } from '@/lib/schemas'
import Fixtures from '@/test-helpers/fixtures'
import { useDataSource } from '@/utils/data-loading'

import ExperimentForm from './ExperimentForm'

export default { title: 'ExperimentCreation' }

export const Form = () => {
  const completionBag = {
    userCompletionDataSource: useDataSource(getUserCompletions, []),
  }
  return (
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({})}
      onSubmit={async (formData: unknown) => alert(JSON.stringify(formData, null, 2))}
      completionBag={completionBag}
    />
  )
}

export const FormWithExistingExperiment = () => {
  const completionBag = {
    userCompletionDataSource: useDataSource(getUserCompletions, []),
  }
  return (
    <ExperimentForm
      indexedMetrics={Normalizers.indexMetrics(Fixtures.createMetricBares(20))}
      indexedSegments={Normalizers.indexSegments(Fixtures.createSegments(20))}
      initialExperiment={experimentToFormData({
        conclusionUrl: 'https://conclusion.example.com',
        deployedVariationId: null,
        description: 'A description',
        endDatetime: new Date(2020, 2, 1, 0, 0, 0),
        endReason: null,
        existingUsersAllowed: true,
        experimentId: 2000,
        exposureEvents: [
          {
            event: 'calypso_page_view',
            props: {
              prop: 'a_value',
            },
          },
          {
            event: 'unknown_event',
            props: {
              hello: 'world',
            },
          },
        ],
        metricAssignments: [],
        name: 'test_experiment',
        ownerLogin: 'unknown',
        p2Url: 'http://example.com',
        platform: Platform.Wpcom,
        segmentAssignments: [],
        startDatetime: new Date(2020, 1, 1, 0, 0, 0),
        status: Status.Staging,
        variations: [],
      })}
      onSubmit={async (formData: unknown) => alert(JSON.stringify(formData, null, 2))}
      completionBag={completionBag}
    />
  )
}
