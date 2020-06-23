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
        { title: 'Name', field: 'name' },
        {
          title: 'Start',
          field: 'startDatetime',
          render: (experiment) => <DatetimeText datetime={experiment.startDatetime} excludeTime />,
        },
        {
          title: 'End',
          field: 'endDatetime',
          render: (experiment) => <DatetimeText datetime={experiment.endDatetime} excludeTime />,
        },
        { title: 'Status', field: 'status' },
        { title: 'Platform', field: 'platform' },
        { title: 'Owner', field: 'ownerLogin' },
      ]}
      data={experiments}
      onRowClick={handleRowClick}
      options={defaultTableOptions}
    />
  )
}

export default ExperimentsTable
