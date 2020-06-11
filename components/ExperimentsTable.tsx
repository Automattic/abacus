import debugFactory from 'debug'
import MaterialTable from 'material-table'
import { useRouter } from 'next/router'
import React from 'react'

import DatetimeText from '@/components/DatetimeText'
import { ExperimentBare } from '@/models'

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
          // eslint-disable-next-line react/display-name
          render: (experiment) => <DatetimeText time={false} value={experiment.startDatetime} />,
        },
        {
          title: 'End',
          field: 'endDatetime',
          // eslint-disable-next-line react/display-name
          render: (experiment) => <DatetimeText time={false} value={experiment.endDatetime} />,
        },
        { title: 'Status', field: 'status' },
        { title: 'Platform', field: 'platform' },
        { title: 'Owner', field: 'ownerLogin' },
      ]}
      data={experiments}
      onRowClick={handleRowClick}
      options={{
        emptyRowsWhenPaging: false,
        pageSize: 25,
        pageSizeOptions: [25, 50, 100],
        showEmptyDataSourceMessage: false,
        showTitle: false,
      }}
    />
  )
}

export default ExperimentsTable
