import { useTheme } from '@material-ui/core'
import debugFactory from 'debug'
import MaterialTable from 'material-table'
import { useRouter } from 'next/router'
import React from 'react'

import DatetimeText from '@/components/DatetimeText'
import { ExperimentBare } from '@/models'
import { defaultTableOptions } from '@/utils/material-table'

const debug = debugFactory('abacus:components/ExperimentsTable.tsx')

/**
 * Renders a table of "bare" experiment information.
 */
const ExperimentsTable = ({ experiments }: { experiments: ExperimentBare[] }) => {
  debug('ExperimentsTable#render')
  const router = useRouter()
  const theme = useTheme()

  /* istanbul ignore next; to be handled by an e2e test */
  const handleRowClick = (event?: React.MouseEvent, rowData?: ExperimentBare) => {
    if (rowData?.status === 'staging') {
      router.push('/experiments/[id]', `/experiments/${rowData?.experimentId}`)
    } else {
      router.push('/experiments/[id]/results', `/experiments/${rowData?.experimentId}/results`)
    }
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
          render: (experiment) => <DatetimeText datetime={experiment.startDatetime} excludeTime />,
          cellStyle: {
            fontFamily: theme.custom.fonts.monospace,
          },
        },
        {
          title: 'End',
          field: 'endDatetime',
          render: (experiment) => <DatetimeText datetime={experiment.endDatetime} excludeTime />,
          cellStyle: {
            fontFamily: theme.custom.fonts.monospace,
          },
        },
      ]}
      data={experiments}
      onRowClick={handleRowClick}
      options={defaultTableOptions}
    />
  )
}

export default ExperimentsTable
