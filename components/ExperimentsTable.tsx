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

const createSortByComparable = (
  name: 'endDatetime' | 'name' | 'ownerLogin' | 'platform' | 'startDatetime' | 'status',
) => {
  return (a: ExperimentBare, b: ExperimentBare) => {
    if (a[name] < b[name]) {
      return -1
    }
    if (a[name] > b[name]) {
      return 1
    }
    return 0
  }
}

const sortByEndDatetime = createSortByComparable('endDatetime')
const sortByName = createSortByComparable('name')
const sortByOwnerLogin = createSortByComparable('ownerLogin')
const sortByPlatform = createSortByComparable('platform')
const sortByStartDatetime = createSortByComparable('startDatetime')
const sortByStatus = createSortByComparable('status')

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
      sorter: sortByName,
    },
    {
      title: 'Start',
      dataIndex: 'startDatetime',
      key: 'startDatetime',
      render: isoDateRenderer,
      sorter: sortByStartDatetime,
    },
    {
      title: 'End',
      dataIndex: 'endDatetime',
      key: 'endDatetime',
      render: isoDateRenderer,
      sorter: sortByEndDatetime,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      sorter: sortByStatus,
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
      sorter: sortByPlatform,
    },
    {
      title: 'Owner',
      dataIndex: 'ownerLogin',
      key: 'ownerLogin',
      sorter: sortByOwnerLogin,
    },
  ]

  return <Table columns={columns} dataSource={experiments} rowKey='experimentId' />
}

export default ExperimentsTable
