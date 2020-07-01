import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import Fixtures from '@/helpers/fixtures'
import { Status } from '@/models'

import ExperimentToolbar from './ExperimentToolbar'

// |                     state                        |
// | exp status: | conclusions: | section: | mode:    | valid:
// | ----------- | ------------ | -------- | -------- | ------
// | complete    | no           | details  | conclude | yes
// | disabled    | no           | details  | conclude | yes
// | complete    | no           | details  | disable  | yes
// | complete    | yes          | details  | disable  | yes
// | running     | n/a          | details  | disable  | yes
// | staging     | n/a          | details  | disable  | yes
// | running     | n/a          | details  | edit     | yes
// | staging     | n/a          | details  | edit     | yes
// | complete    | no           | details  | view     | yes
// | complete    | yes          | details  | view     | yes
// | disabled    | no           | details  | view     | yes
// | disabled    | yes          | details  | view     | yes
// | running     | n/a          | details  | view     | yes
// | staging     | n/a          | details  | view     | yes
// | n/a         | n/a          | results  | view     | yes
// | n/a         | n/a          | snippets | view     | yes

test('with a complete experiment, no conclusions, on details section, and in conclude mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='conclude' section='details' />)

  // Expect "Cancel" and "Save Conclusions" buttons.
  expect(container).toMatchSnapshot()
})

test('with a disabled experiment, no conclusions, on details section, and in conclude mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Disabled,
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='conclude' section='details' />)

  // Expect "Cancel" and "Save Conclusions" buttons.
  expect(container).toMatchSnapshot()
})

test('with a complete experiment, no conclusions, on details section, and in disable mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='disable' section='details' />)

  // Expect disabled "Disable" and disabled "Add Conclusions" buttons.
  expect(container).toMatchSnapshot()
})

test('with a complete experiment, with conclusion, on details section, and in disable mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    endReason: 'Ran its course.',
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='disable' section='details' />)

  // Expect disabled "Disable" and disabled "Edit" buttons.
  expect(container).toMatchSnapshot()
})

test('with a running experiment, on details section, and in disable mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Running,
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='disable' section='details' />)

  // Expect disabled "Disable" and disabled "Edit" buttons.
  expect(container).toMatchSnapshot()
})

test('with a staging experiment, on details section, and in disable mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Staging,
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='disable' section='details' />)

  // Expect disabled "Disable" and disabled "Edit" buttons.
  expect(container).toMatchSnapshot()
})

test('with a running experiment, on details section, and in edit mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Running,
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='edit' section='details' />)

  // Expect "Cancel" and "Update Details" buttons.
  expect(container).toMatchSnapshot()
})

test('with a staging experiment, on details section, and in edit mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Staging,
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='edit' section='details' />)

  // Expect "Cancel" and "Update Details" buttons.
  expect(container).toMatchSnapshot()
})

test('with a complete experiment, no conclusions, on details section, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='view' section='details' />)

  // Expect "Disable" and "Add Conclusions" buttons.
  expect(container).toMatchSnapshot()
})

test('with a complete experiment, with conclusions, on details section, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    endReason: 'Ran its course.',
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='view' section='details' />)

  // Expect "Disable" and "Edit" buttons.
  expect(container).toMatchSnapshot()
})

test('with a disabled experiment, no conclusions, on details section, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Disabled,
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='view' section='details' />)

  // Expect "Add Conclusions" button.
  expect(container).toMatchSnapshot()
})

test('with a disabled experiment, with conclusion, on details section, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Disabled,
    endReason: 'Ran its course.',
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='view' section='details' />)

  // Expect "Edit" button.
  expect(container).toMatchSnapshot()
})

test('with a running experiment, on details section, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Running,
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='view' section='details' />)

  // Expect "Disable" and "Edit" buttons.
  expect(container).toMatchSnapshot()
})

test('with a staging experiment, on details section, and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull({
    status: Status.Staging,
  })
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='view' section='details' />)

  // Expect "Disable" and "Edit" buttons.
  expect(container).toMatchSnapshot()
})

test('on results section and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='view' section='results' />)

  // Expect no toolbar buttons.
  expect(container).toMatchSnapshot()
})

test('on snippets section and in view mode will render expected buttons', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<ExperimentToolbar experiment={experiment} mode='view' section='snippets' />)

  // Expect no toolbar buttons.
  expect(container).toMatchSnapshot()
})

test('clicking "Disable" button calls `onDisabled` callback', () => {
  const handleDisable = jest.fn()
  const experiment = Fixtures.createExperimentFull({ status: Status.Staging })
  const { getByText } = render(
    <ExperimentToolbar experiment={experiment} mode='view' onDisable={handleDisable} section='details' />,
  )

  const disableElmt = getByText('Disable')

  fireEvent.click(disableElmt)

  expect(handleDisable).toHaveBeenCalledTimes(1)
})

test('clicking "Edit" button calls `onEdit` callback', () => {
  const handleEdit = jest.fn()
  const experiment = Fixtures.createExperimentFull({ status: Status.Staging })
  const { getByText } = render(
    <ExperimentToolbar experiment={experiment} mode='view' onEdit={handleEdit} section='details' />,
  )

  const editElmt = getByText('Edit')

  fireEvent.click(editElmt)

  expect(handleEdit).toHaveBeenCalledTimes(1)
})

test('clicking "Cancel" button calls `onCancel` callback', () => {
  const handleCancel = jest.fn()
  const experiment = Fixtures.createExperimentFull({ status: Status.Staging })
  const { getByText } = render(
    <ExperimentToolbar experiment={experiment} mode='edit' onCancel={handleCancel} section='details' />,
  )

  const cancelElmt = getByText('Cancel')

  fireEvent.click(cancelElmt)

  expect(handleCancel).toHaveBeenCalledTimes(1)
})

test('clicking "Update Details" button calls `onSave` callback', () => {
  const handleSave = jest.fn()
  const experiment = Fixtures.createExperimentFull({ status: Status.Staging })
  const { getByText } = render(
    <ExperimentToolbar experiment={experiment} mode='edit' onSave={handleSave} section='details' />,
  )

  const updateDetailsElmt = getByText('Update Details')

  fireEvent.click(updateDetailsElmt)

  expect(handleSave).toHaveBeenCalledTimes(1)
})

test('clicking "Add Conclusions" button calls `onConclude` callback', () => {
  const handleConclude = jest.fn()
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(
    <ExperimentToolbar experiment={experiment} mode='view' onConclude={handleConclude} section='details' />,
  )

  const addConclusionsElmt = getByText('Add Conclusions')

  fireEvent.click(addConclusionsElmt)

  expect(handleConclude).toHaveBeenCalledTimes(1)
})

test('clicking "Cancel" button calls `onCancel` callback', () => {
  const handleCancel = jest.fn()
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(
    <ExperimentToolbar experiment={experiment} mode='conclude' onCancel={handleCancel} section='details' />,
  )

  const cancelElmt = getByText('Cancel')

  fireEvent.click(cancelElmt)

  expect(handleCancel).toHaveBeenCalledTimes(1)
})

test('clicking "Save Conclusions" button calls `onSave` callback', () => {
  const handleSave = jest.fn()
  const experiment = Fixtures.createExperimentFull()
  const { getByText } = render(
    <ExperimentToolbar experiment={experiment} mode='conclude' onSave={handleSave} section='details' />,
  )

  const saveConclusionsElmt = getByText('Save Conclusions')

  fireEvent.click(saveConclusionsElmt)

  expect(handleSave).toHaveBeenCalledTimes(1)
})
