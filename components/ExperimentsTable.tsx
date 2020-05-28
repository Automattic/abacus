import { Table } from 'antd'
import { format } from 'date-fns'
import debugFactory from 'debug'
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

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Start',
      dataIndex: 'startDatetime',
      key: 'startDatetime',
      render: isoDateRenderer,
    },
    {
      title: 'End',
      dataIndex: 'endDatetime',
      key: 'endDatetime',
      render: isoDateRenderer,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: 'Owner',
      dataIndex: 'ownerLogin',
      key: 'ownerLogin',
    },
  ]

  return <Table columns={columns} dataSource={experiments} rowKey='experimentId' />
}

export default ExperimentsTable
