import '@/styles/main.scss'

import addToDate from 'date-fns/add'
import React from 'react'

import { ExperimentBare, Platform, Status } from '@/models'

import ExperimentsTable from './ExperimentsTable'

export default { title: 'ExperimentsTable' }

const experiments: ExperimentBare[] = []

export const withNoExperiments = () => <ExperimentsTable experiments={experiments} />

const endDatetime = addToDate(new Date(), { days: 14 })
const startDatetime = new Date()

const EXPERIMENT_TEMPLATE = {
  description: 'The description.',
  endDatetime,
  ownerLogin: 'Owner',
  platform: Platform.Wpcom,
  startDatetime,
  status: Status.Staging,
}

const onePageOfExperiments: ExperimentBare[] = [
  {
    ...EXPERIMENT_TEMPLATE,
    experimentId: 1,
    name: 'First',
  },
  {
    ...EXPERIMENT_TEMPLATE,
    experimentId: 2,
    name: 'Second',
    platform: Platform.Calypso,
    status: Status.Running,
  },
  {
    ...EXPERIMENT_TEMPLATE,
    experimentId: 3,
    name: 'Third',
    status: Status.Completed,
  },
  {
    ...EXPERIMENT_TEMPLATE,
    experimentId: 4,
    name: 'Fourth',
    platform: Platform.Calypso,
    status: Status.Disabled,
  },
]

export const withOnePageOfExperiments = () => <ExperimentsTable experiments={onePageOfExperiments} />

const moreThanOnePageOfExperiments: ExperimentBare[] = Array.from(Array(40).keys()).map((num) => ({
  experimentId: num + 1,
  name: `Name${num + 1}`,
  endDatetime,
  ownerLogin: 'Owner',
  platform: Platform.Wpcom,
  startDatetime,
  status: Status.Staging,
}))

export const withMoreThanOnePageOfExperiments = () => <ExperimentsTable experiments={moreThanOnePageOfExperiments} />
