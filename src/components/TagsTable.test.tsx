import { fireEvent, getByText, screen } from '@testing-library/react'
import React from 'react'

import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

import TagsTable from './TagsTable'

test('with no tags, renders an empty table', () => {
  const { container, getByText } = render(<TagsTable tags={[]} />)

  expect(getByText('Tag')).toBeInTheDocument()
  expect(getByText('Description')).toBeInTheDocument()

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(tBodyElmt).toHaveTextContent('')
})

test('with some tags, renders a table', () => {
  const { container } = render(<TagsTable tags={Fixtures.createTagBares(2)} />)

  const tBodyElmt = container.querySelector('tbody') as HTMLTableSectionElement
  expect(tBodyElmt).not.toBeNull()
  expect(getByText(tBodyElmt, 'tag_namespace_1/tag_1', { selector: 'tr > td' })).toBeInTheDocument()
  expect(getByText(tBodyElmt, 'This is tag 1', { selector: 'tr > td' })).toBeInTheDocument()
})

test('with some tags and canEditTags can click on the edit button', () => {
  const onEditTag = jest.fn()
  render(<TagsTable tags={Fixtures.createTagBares(2)} onEditTag={onEditTag} />)

  const edits = screen.getAllByRole('button', { name: 'Edit Tag' })

  fireEvent.click(edits[0])

  expect(onEditTag.mock.calls.length).toBe(1)
})
