import { getByText } from '@testing-library/react'
import addToDate from 'date-fns/add'
import React from 'react'

import { render } from '@/helpers/test-utils'
import { ExperimentBare, Platform, Status } from '@/lib/schemas'

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
