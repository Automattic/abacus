import debugFactory from 'debug'
import MaterialTable from 'material-table'
import { useRouter } from 'next/router'
import React from 'react'

import { MetricBare } from '@/models'

const debug = debugFactory('abacus:components/MetricsTable.tsx')

const tableColumns = [
  { title: 'Name', field: 'name' },
  { title: 'Description', field: 'description' },
  { title: 'Parameter Type', field: 'parameterType' },
]

const tableOptions = {
  emptyRowsWhenPaging: false,
  pageSize: 25,
  pageSizeOptions: [25, 50, 100],
  showEmptyDataSourceMessage: false,
  showTitle: false,
}

/**
 * Renders a table of "bare" metric information.
 */
const MetricsTable = ({ metrics }: { metrics: MetricBare[] }) => {
  debug('MetricsTable#render')
  const router = useRouter()

  /* istanbul ignore next; to be handled by an e2e test */
  const onSelectMetric = (metricId: number) => {
    router.push('/metrics/[id]', `/metrics/${metricId}`)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  const onRowClick = (event?: React.MouseEvent, rowData?: MetricBare) => {
    if (!rowData) {
      throw new Error('Missing rowData')
    }
    onSelectMetric(rowData.metricId)
  }

  return <MaterialTable columns={tableColumns} data={metrics} onRowClick={onRowClick} options={tableOptions} />
}

export default MetricsTable
