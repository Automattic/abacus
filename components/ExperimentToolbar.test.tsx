import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { Status } from '@/models'

import ExperimentToolbar from './ExperimentToolbar'

// |                     state                        |
// | exp status: | conclusions: | mode:    | valid:
// | ----------- | ------------ | -------- | ------
// | complete    | no           | conclude | yes
// | disabled    | no           | conclude | yes
// | complete    | no           | disable  | yes
// | complete    | yes          | disable  | yes
// | running     | n/a          | disable  | yes
// | staging     | n/a          | disable  | yes
// | running     | n/a          | edit     | yes
// | staging     | n/a          | edit     | yes
// | complete    | no           | view     | yes
// | complete    | yes          | view     | yes
// | disabled    | no           | view     | yes
// | disabled    | yes          | view     | yes
// | running     | n/a          | view     | yes
// | staging     | n/a          | view     | yes

test('with a complete experiment, no conclusions, and in conclude mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='conclude' />)

  // Expect "Cancel" and "Save Conclusions" buttons.
  expect(getByText('Cancel', { selector: 'button *' })).toBeInTheDocument()
  expect(getByText('Save Conclusions', { selector: 'button *' })).toBeInTheDocument()
})

test('with a disabled experiment, no conclusions, and in conclude mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Disabled,
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='conclude' />)

  // Expect "Cancel" and "Save Conclusions" buttons.
  expect(getByText('Cancel', { selector: 'button *' })).toBeInTheDocument()
  expect(getByText('Save Conclusions', { selector: 'button *' })).toBeInTheDocument()
})

test('with a complete experiment, no conclusions, and in disable mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='disable' />)

  // Expect disabled "Disable" and disabled "Add Conclusions" buttons.
  expect(getByText('Disable', { selector: 'button:disabled *' })).toBeInTheDocument()
  expect(getByText('Add Conclusions', { selector: 'button:disabled *' })).toBeInTheDocument()
})

test('with a complete experiment, with conclusion, and in disable mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    endReason: 'Ran its course.',
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='disable' />)

  // Expect disabled "Disable" and disabled "Edit" buttons.
  expect(getByText('Disable', { selector: 'button:disabled *' })).toBeInTheDocument()
  expect(getByText('Edit', { selector: 'button:disabled *' })).toBeInTheDocument()
})

test('with a running experiment and in disable mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Running,
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='disable' />)

  // Expect disabled "Disable" and disabled "Edit" buttons.
  expect(getByText('Disable', { selector: 'button:disabled *' })).toBeInTheDocument()
  expect(getByText('Edit', { selector: 'button:disabled *' })).toBeInTheDocument()
})

test('with a staging experiment and in disable mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Staging,
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='disable' />)

  // Expect disabled "Disable" and disabled "Edit" buttons.
  expect(getByText('Disable', { selector: 'button:disabled *' })).toBeInTheDocument()
  expect(getByText('Edit', { selector: 'button:disabled *' })).toBeInTheDocument()
})

test('with a running experiment and in edit mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Running,
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='edit' />)

  // Expect "Cancel" and "Update Details" buttons.
  expect(getByText('Cancel', { selector: 'button *' })).toBeInTheDocument()
  expect(getByText('Update Details', { selector: 'button *' })).toBeInTheDocument()
})

test('with a staging experiment and in edit mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Staging,
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='edit' />)

  // Expect "Cancel" and "Update Details" buttons.
  expect(getByText('Cancel', { selector: 'button *' })).toBeInTheDocument()
  expect(getByText('Update Details', { selector: 'button *' })).toBeInTheDocument()
})

test('with a complete experiment, no conclusions, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' />)

  // Expect "Disable" and "Add Conclusions" buttons.
  expect(getByText('Disable', { selector: 'button *' })).toBeInTheDocument()
  expect(getByText('Add Conclusions', { selector: 'button *' })).toBeInTheDocument()
})

test('with a complete experiment, with conclusions, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    endReason: 'Ran its course.',
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' />)

  // Expect "Disable" and "Edit" buttons.
  expect(getByText('Disable', { selector: 'button *' })).toBeInTheDocument()
  expect(getByText('Edit', { selector: 'button *' })).toBeInTheDocument()
})

test('with a disabled experiment, no conclusions, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Disabled,
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' />)

  // Expect "Add Conclusions" button.
  expect(getByText('Add Conclusions', { selector: 'button *' })).toBeInTheDocument()
})

test('with a disabled experiment, with conclusion, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Disabled,
    endReason: 'Ran its course.',
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' />)

  // Expect "Edit" button.
  expect(getByText('Edit', { selector: 'button *' })).toBeInTheDocument()
})

test('with a running experiment and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Running,
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' />)

  // Expect "Disable" and "Edit" buttons.
  expect(getByText('Disable', { selector: 'button *' })).toBeInTheDocument()
  expect(getByText('Edit', { selector: 'button *' })).toBeInTheDocument()
})

test('with a staging experiment and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Staging,
  })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' />)

  // Expect "Disable" and "Edit" buttons.
  expect(getByText('Disable', { selector: 'button *' })).toBeInTheDocument()
  expect(getByText('Edit', { selector: 'button *' })).toBeInTheDocument()
})

test('clicking "Disable" button calls `onDisabled` callback', () => {
  const handleDisable = jest.fn()
  const experiment = Fixtures.createExperimentFull({ status: Status.Staging })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' onDisable={handleDisable} />)

  const disableElmt = getByText('Disable')

  fireEvent.click(disableElmt)

  expect(handleDisable).toHaveBeenCalledTimes(1)
})

test('clicking "Edit" button calls `onEdit` callback', () => {
  const handleEdit = jest.fn()
  const experiment = Fixtures.createExperimentFull({ status: Status.Staging })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' onEdit={handleEdit} />)

  const editElmt = getByText('Edit')

  fireEvent.click(editElmt)

  expect(handleEdit).toHaveBeenCalledTimes(1)
})

test('clicking "Cancel" button calls `onCancel` callback', () => {
  const handleCancel = jest.fn()
  const experiment = Fixtures.createExperimentFull({ status: Status.Staging })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='edit' onCancel={handleCancel} />)

  const cancelElmt = getByText('Cancel')

  fireEvent.click(cancelElmt)

  expect(handleCancel).toHaveBeenCalledTimes(1)
})

test('clicking "Update Details" button calls `onSave` callback', () => {
  const handleSave = jest.fn()
  const experiment = Fixtures.createExperimentFull({ status: Status.Staging })
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='edit' onSave={handleSave} />)

  const updateDetailsElmt = getByText('Update Details')

  fireEvent.click(updateDetailsElmt)

  expect(handleSave).toHaveBeenCalledTimes(1)
})

test('clicking "Add Conclusions" button calls `onConclude` callback', () => {
  const handleConclude = jest.fn()
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='view' onConclude={handleConclude} />)

  const addConclusionsElmt = getByText('Add Conclusions')

  fireEvent.click(addConclusionsElmt)

  expect(handleConclude).toHaveBeenCalledTimes(1)
})

test('clicking "Cancel" button calls `onCancel` callback', () => {
  const handleCancel = jest.fn()
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='conclude' onCancel={handleCancel} />)

  const cancelElmt = getByText('Cancel')

  fireEvent.click(cancelElmt)

  expect(handleCancel).toHaveBeenCalledTimes(1)
})

test('clicking "Save Conclusions" button calls `onSave` callback', () => {
  const handleSave = jest.fn()
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(<ExperimentToolbar experiment={experiment} mode='conclude' onSave={handleSave} />)

  const saveConclusionsElmt = getByText('Save Conclusions')

  fireEvent.click(saveConclusionsElmt)

  expect(handleSave).toHaveBeenCalledTimes(1)
})
