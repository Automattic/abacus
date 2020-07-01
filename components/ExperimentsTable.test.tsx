import { fireEvent, getAllByText, getByText, getByTitle } from '@testing-library/react'
import addToDate from 'date-fns/add'
import React from 'react'

import { render } from '@/helpers/test-utils'
import { ExperimentBare, Platform, Status } from '@/models'

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
  expect(tBodyElmt).toHaveTextContent('')
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
  expect(getByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toBeInTheDocument()
})

test('with more than one page of experiments, renders a table with a pagination control', () => {
  const PER_PAGE = 25
  const COUNT = 31 // Some value greater than "per page".
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
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(PER_PAGE)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(PER_PAGE)

  const tFootElmt = container.querySelector('tfoot') as HTMLTableSectionElement
  expect(tFootElmt).not.toBeNull()
  const nextBtnContainer = getByTitle(tFootElmt, 'Next Page')
  expect(nextBtnContainer).not.toBeNull()
  const nextBtn = nextBtnContainer.querySelector('button') as HTMLButtonElement

  // Click "next" button
  fireEvent.click(nextBtn)

  // Should be on the second page now.
  tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'Name26', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(COUNT - PER_PAGE)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(COUNT - PER_PAGE)

  const prevBtnContainer = getByTitle(tFootElmt, 'Previous Page')
  expect(prevBtnContainer).not.toBeNull()
  const prevBtn = prevBtnContainer.querySelector('button') as HTMLButtonElement

  // Click "page 1" button
  fireEvent.click(prevBtn)

  // Should be back on the first page again.
  tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'Name1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getAllByText(tBodyElmt, 'wpcom', { selector: 'tr > td' })).toHaveLength(PER_PAGE)
  expect(getAllByText(tBodyElmt, 'Owner', { selector: 'tr > td' })).toHaveLength(PER_PAGE)
})
