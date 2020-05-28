import { fireEvent, getAllByText, getByText, render } from '@testing-library/react'
import addToDate from 'date-fns/add'
import React from 'react'

import { ExperimentBare } from '@/models/ExperimentBare'
import { Platform } from '@/models/Platform'
import { Status } from '@/models/Status'

import ExperimentsTable from './ExperimentsTable'

test('with no experiments, renders an empty table', () => {
  const experiments: ExperimentBare[] = []
  const { container, getByText } = render(<ExperimentsTable experiments={experiments} />)

  expect(getByText('Name')).toBeInTheDocument()
  expect(getByText('Start')).toBeInTheDocument()
  expect(getByText('End')).toBeInTheDocument()
  expect(getByText('Status')).toBeInTheDocument()
  expect(getByText('Platform')).toBeInTheDocument()
  expect(getByText('Owner')).toBeInTheDocument()

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(tBodyElmt.childElementCount).toBe(1)

  expect(getByText('No Data', { selector: '.ant-table-placeholder .ant-empty-description' })).toBeInTheDocument()
})

test('with one page of experiments, renders a table', () => {
  const experiments: ExperimentBare[] = [
    {
      experimentId: 1,
      name: 'First',
      endDatetime: addToDate(new Date(), { days: 14 }),
      ownerLogin: 'Owner',
      platform: Platform.Wpcom,
      startDatetime: new Date(),
      status: Status.Staging,
    },
  ]
  const { container } = render(<ExperimentsTable experiments={experiments} />)

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'First', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'staging', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toBeInTheDocument()
})

test('with more than one page of experiments, renders a table with a pagination control', () => {
  const COUNT = 15 // Some value greater than "per page". Defaults to 10.
  const startDatetime = new Date()
  const endDatetime = addToDate(new Date(), { days: 14 })
  const experiments: ExperimentBare[] = Array.from(Array(COUNT).keys()).map((num) => ({
    experimentId: num + 1,
    name: `Name${num + 1}`,
    endDatetime,
    ownerLogin: 'Owner',
    platform: Platform.Wpcom,
    startDatetime,
    status: Status.Staging,
  }))

  const { container } = render(<ExperimentsTable experiments={experiments} />)

  let tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'Name1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getAllByText(tBodyElmt, 'staging', { selector: 'tr > td' })).toHaveLength(10)
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(10)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(10)

  const paginationItemElmts = container.querySelectorAll<HTMLElement>('.ant-table-pagination li')
  // There should be two direct page buttons, one prev, and one next button.
  expect(paginationItemElmts.length).toBe(4)

  // The first direct page button should have text '1' and be active.
  expect(
    getByText(paginationItemElmts.item(1), '1', { selector: 'li.ant-pagination-item-active a' }),
  ).toBeInTheDocument()

  // The second direct page button should have text '2' and not be active.
  expect(
    getByText(paginationItemElmts.item(2), '2', {
      selector: 'li:not(.ant-pagination-item-active) a',
    }),
  ).toBeInTheDocument()

  // Click "next" button
  fireEvent.click(paginationItemElmts.item(3))

  // Should be on the second page now.
  tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'Name11', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getAllByText(tBodyElmt, 'staging', { selector: 'tr > td' })).toHaveLength(COUNT - 10)
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(COUNT - 10)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(COUNT - 10)

  // The first direct page button should have text '1' and be not be active.
  expect(
    getByText(paginationItemElmts.item(1), '1', {
      selector: 'li:not(.ant-pagination-item-active) a',
    }),
  ).toBeInTheDocument()

  // The second direct page button should have text '2' and not be active.
  expect(
    getByText(paginationItemElmts.item(2), '2', { selector: 'li.ant-pagination-item-active a' }),
  ).toBeInTheDocument()

  // Click "page 1" button
  fireEvent.click(paginationItemElmts.item(1))

  // Should be back on the first page again.
  tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'Name1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getAllByText(tBodyElmt, 'staging', { selector: 'tr > td' })).toHaveLength(10)
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(10)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(10)

  // The first direct page button should have text '1' and be active.
  expect(
    getByText(paginationItemElmts.item(1), '1', { selector: 'li.ant-pagination-item-active a' }),
  ).toBeInTheDocument()

  // The second direct page button should have text '2' and not be active.
  expect(
    getByText(paginationItemElmts.item(2), '2', {
      selector: 'li:not(.ant-pagination-item-active) a',
    }),
  ).toBeInTheDocument()
})
