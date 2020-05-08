import { fireEvent, getAllByText, getByText, render } from '@testing-library/react'
import React from 'react'

import { Experiment } from '@/models/Experiment'
import { Platform } from '@/models/Platform'
import { Status } from '@/models/Status'

import ExperimentsTable, { PER_PAGE_DEFAULT } from './ExperimentsTable'

test('with no experiments, renders an empty table', () => {
  const experiments: Experiment[] = []
  const { getByText } = render(<ExperimentsTable experiments={experiments} />)

  expect(getByText('ID')).toBeInTheDocument()
  expect(getByText('Name')).toBeInTheDocument()
  expect(getByText('Started')).toBeInTheDocument()
  expect(getByText('Ends')).toBeInTheDocument()
  expect(getByText('Status')).toBeInTheDocument()
  expect(getByText('Platform')).toBeInTheDocument()
  expect(getByText('Owner')).toBeInTheDocument()
})

test('with one page of experiments, renders a table', () => {
  const experiments: Experiment[] = [
    {
      experimentId: 1,
      name: 'First',
      description: 'The first ever experiment.',
      endDatetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      existingUsersAllowed: true,
      metricAssignments: [],
      ownerLogin: 'Owner',
      p2Url: 'http://p2.a8c.com/',
      platform: Platform.Wpcom,
      segmentAssignments: [],
      startDatetime: new Date(),
      status: Status.Staging,
      variations: [],
    },
  ]
  const { container } = render(<ExperimentsTable experiments={experiments} />)

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, '1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'First', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'staging', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toBeInTheDocument()
})

test('with more than one page of experiments, renders a table with a pagination control', () => {
  const COUNT = 40 // Some value greater than "per page"
  const startDatetime = new Date()
  const endDatetime = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  const experiments: Experiment[] = Array.from(Array(COUNT).keys()).map((num) => ({
    experimentId: num + 1,
    name: `Name${num + 1}`,
    description: 'The description.',
    endDatetime,
    existingUsersAllowed: true,
    metricAssignments: [],
    ownerLogin: 'Owner',
    p2Url: 'http://p2.a8c.com/',
    platform: Platform.Wpcom,
    segmentAssignments: [],
    startDatetime,
    status: Status.Staging,
    variations: [],
  }))

  const { container } = render(<ExperimentsTable experiments={experiments} />)

  let tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, '1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'Name1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getAllByText(tBodyElmt, 'staging', { selector: 'tr > td' })).toHaveLength(PER_PAGE_DEFAULT)
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(PER_PAGE_DEFAULT)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(PER_PAGE_DEFAULT)

  const tFootElmt = container.querySelector('tfoot') as HTMLTableSectionElement
  expect(tFootElmt).not.toBeNull()
  const menuItemElmts = tFootElmt.querySelectorAll<HTMLElement>('tr .item')
  // There should be two direct page buttons and one prev and one next button.
  expect(menuItemElmts.length).toBe(4)

  // The first direct page button should have text '1' and be active.
  expect(getByText(menuItemElmts.item(1), '1', { selector: 'tr .item.active' })).toBeInTheDocument()

  // The second direct page button should have text '2' and not be active.
  expect(getByText(menuItemElmts.item(2), '2', { selector: 'tr .item:not(.active)' })).toBeInTheDocument()

  // Click "next" button
  fireEvent.click(menuItemElmts.item(3))

  // Should be on the second page now.
  tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, '26', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'Name26', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getAllByText(tBodyElmt, 'staging', { selector: 'tr > td' })).toHaveLength(COUNT - PER_PAGE_DEFAULT)
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(COUNT - PER_PAGE_DEFAULT)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(COUNT - PER_PAGE_DEFAULT)

  // The first direct page button should have text '1' and be not be active.
  expect(getByText(menuItemElmts.item(1), '1', { selector: 'tr .item:not(.active)' })).toBeInTheDocument()

  // The second direct page button should have text '2' and not be active.
  expect(getByText(menuItemElmts.item(2), '2', { selector: 'tr .item.active' })).toBeInTheDocument()

  // Click "page 1" button
  fireEvent.click(menuItemElmts.item(1))

  // Should be back on the first page again.
  tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, '1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'Name1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getAllByText(tBodyElmt, 'staging', { selector: 'tr > td' })).toHaveLength(PER_PAGE_DEFAULT)
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(PER_PAGE_DEFAULT)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(PER_PAGE_DEFAULT)

  // The first direct page button should have text '1' and be active.
  expect(getByText(menuItemElmts.item(1), '1', { selector: 'tr .item.active' })).toBeInTheDocument()

  // The second direct page button should have text '2' and not be active.
  expect(getByText(menuItemElmts.item(2), '2', { selector: 'tr .item:not(.active)' })).toBeInTheDocument()
})
