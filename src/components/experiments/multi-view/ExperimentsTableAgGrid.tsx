import { useTheme } from '@material-ui/core'
import debugFactory from 'debug'
import MaterialTable from 'material-table'
import React from 'react'
import { useHistory } from 'react-router-dom'

import DatetimeText from 'src/components/general/DatetimeText'
import { ExperimentBare } from 'src/lib/schemas'
import { createIdSlug } from 'src/utils/general'
import { defaultTableOptions } from 'src/utils/material-table'

import ExperimentStatus from '../ExperimentStatus'

const debug = debugFactory('abacus:components/ExperimentsTable.tsx')

/**
 * Renders a table of "bare" experiment information.
 */
const ExperimentsTable = ({ experiments }: { experiments: ExperimentBare[] }): JSX.Element => {
  debug('ExperimentsTable#render')
  const history = useHistory()
  const theme = useTheme()

  /* istanbul ignore next; to be handled by an e2e test */
  const handleRowClick = (event?: React.MouseEvent, rowData?: ExperimentBare) => {
    if (!rowData) {
      throw new Error('Missing experimentId')
    }
    history.push(`/experiments/${createIdSlug(rowData.experimentId, rowData.name)}`)
  }

  return (
    <MaterialTable
      columns={[
        {
          title: 'Name',
          field: 'name',
          cellStyle: {
            fontFamily: theme.custom.fonts.monospace,
            fontWeight: 600,
          },
        },
        {
          title: 'Status',
          field: 'status',
          render: (experiment) => <ExperimentStatus status={experiment.status} />,
        },
        {
          title: 'Platform',
          field: 'platform',
          cellStyle: {
            fontFamily: theme.custom.fonts.monospace,
          },
        },
        {
          title: 'Owner',
          field: 'ownerLogin',
          cellStyle: {
            fontFamily: theme.custom.fonts.monospace,
          },
        },
        {
          title: 'Start',
          field: 'startDatetime',
          defaultSort: 'desc',
          render: (experiment) => <DatetimeText datetime={experiment.startDatetime} excludeTime />,
        },
        {
          title: 'End',
          field: 'endDatetime',
          render: (experiment) => <DatetimeText datetime={experiment.endDatetime} excludeTime />,
        },
      ]}
      data={experiments}
      onRowClick={handleRowClick}
      options={defaultTableOptions}
    />
  )
}

export default ExperimentsTable
