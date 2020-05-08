import '@/styles/main.scss'

import React from 'react'

import { Experiment } from '@/models/Experiment'
import { Platform } from '@/models/Platform'
import { Status } from '@/models/Status'

import ExperimentsTable from './ExperimentsTable'

export default { title: 'ExperimentsTable' }

const experiments: Experiment[] = []

export const withNoExperiments = () => <ExperimentsTable experiments={experiments} />

const endDatetime = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
const startDatetime = new Date()

const EXPERIMENT_TEMPLATE = {
  description: 'The description.',
  endDatetime,
  existingUsersAllowed: true,
  metricAssignments: [],
  ownerLogin: 'Owner',
  p2Url: 'http://p2.a8c.com/',
  platform: Platform.Wpcom,
  segmentAssignments: [],
  startDatetime,
  status: Status.Staging,
  variations: [],
}

const onePageOfExperiments: Experiment[] = [
  {
    ...EXPERIMENT_TEMPLATE,
    experimentId: 1,
    name: 'First',
    description: 'The first ever experiment.',
  },
  {
    ...EXPERIMENT_TEMPLATE,
    experimentId: 2,
    name: 'Second',
    description: 'The second ever experiment.',
    platform: Platform.Calypso,
    status: Status.Running,
  },
  {
    ...EXPERIMENT_TEMPLATE,
    experimentId: 3,
    name: 'Third',
    description: 'The third ever experiment.',
    endReason: 'Because it was completed.',
    status: Status.Completed,
  },
  {
    ...EXPERIMENT_TEMPLATE,
    experimentId: 4,
    name: 'Fourth',
    description: 'The fourth ever experiment.',
    endReason: 'Because it had to be disabled.',
    platform: Platform.Calypso,
    status: Status.Disabled,
  },
]

export const withOnePageOfExperiments = () => <ExperimentsTable experiments={onePageOfExperiments} />

const moreThanOnePageOfExperiments: Experiment[] = Array.from(Array(40).keys()).map((num) => ({
  experimentId: num + 1,
  name: `Name${num + 1}`,
  description: 'The description.',
  endDatetime,
  existingUsersAllowed: true,
  metricAssignments: [],
  ownerLogin: 'Owner',
  p2Url: 'http://p2.a8c.com/',
  platform: Platform.Wpcom,
  segmentAssignments: [],
  startDatetime,
  status: Status.Staging,
  variations: [],
}))

export const withMoreThanOnePageOfExperiments = () => <ExperimentsTable experiments={moreThanOnePageOfExperiments} />
