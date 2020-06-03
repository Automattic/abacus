import { format } from 'date-fns'
import debugFactory from 'debug'
import MaterialTable from 'material-table'
import React from 'react'

import { ExperimentBare } from '@/models/index'

/**
 * Renders the date in ISO-8601 date-only format.
 */
const isoDateRenderer = (date: Date) => <span className='whitespace-no-wrap'>{format(date, 'yyyy-MM-dd')}</span>

const debug = debugFactory('abacus:components/ExperimentsTable.tsx')

interface Props {
  experiments: ExperimentBare[]
}

/**
 * Renders a table of "bare" experiment information.
 */
const ExperimentsTable = (props: Props) => {
  debug('ExperimentsTable#render')
  const { experiments } = props

  return (
    <MaterialTable
      columns={[
        { title: 'Name', field: 'name' },
        { title: 'Start', field: 'startDatetime', render: (experiment) => isoDateRenderer(experiment.endDatetime) },
        { title: 'End', field: 'endDatetime', render: (experiment) => isoDateRenderer(experiment.endDatetime) },
        { title: 'Status', field: 'status' },
        { title: 'Platform', field: 'platform' },
        { title: 'Owner', field: 'ownerLogin' },
      ]}
      data={experiments}
      options={{ showEmptyDataSourceMessage: false, showTitle: false }}
    />
  )
}

export default ExperimentsTable
