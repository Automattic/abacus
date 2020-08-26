import { fireEvent, screen, waitFor } from '@testing-library/react'
import MockDate from 'mockdate'
import * as notistack from 'notistack'
import React from 'react'

import { Status } from '@/lib/schemas'
import Fixtures from '@/test-helpers/fixtures'
import { render } from '@/test-helpers/test-utils'

import GeneralPanel from './GeneralPanel'

MockDate.set('2020-07-21')

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

test('renders as expected', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<GeneralPanel experiment={experiment} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <div
          class="MuiToolbar-root MuiToolbar-regular MuiToolbar-gutters"
        >
          <h3
            class="MuiTypography-root makeStyles-title-2 MuiTypography-h3 MuiTypography-colorTextPrimary"
          >
            General
          </h3>
          <button
            class="MuiButtonBase-root MuiButton-root MuiButton-outlined"
            tabindex="0"
            type="button"
          >
            <span
              class="MuiButton-label"
            >
              <svg
                aria-hidden="true"
                class="MuiSvgIcon-root"
                focusable="false"
                viewBox="0 0 24 24"
              >
                <path
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
              Edit
            </span>
            <span
              class="MuiTouchRipple-root"
            />
          </button>
        </div>
        <table
          class="MuiTable-root"
        >
          <tbody
            class="MuiTableBody-root"
          >
            <tr
              class="MuiTableRow-root"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="cell"
                scope="row"
              >
                Description
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Experiment with things. Change stuff. Profit.
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="cell"
                scope="row"
              >
                P2 Link
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <a
                  href="https://wordpress.com/experiment_1"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://wordpress.com/experiment_1
                </a>
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="cell"
                scope="row"
              >
                Dates
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span
                  class="makeStyles-root-5"
                  title="20/09/2020, 20:00:00"
                >
                  2020-09-21
                </span>
                <span
                  class="makeStyles-to-1"
                >
                  to
                </span>
                <span
                  class="makeStyles-root-5"
                  title="20/11/2020, 20:00:00"
                >
                  2020-11-21
                </span>
              </td>
            </tr>
            <tr
              class="MuiTableRow-root"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                role="cell"
                scope="row"
              >
                Owner
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                test_a11n
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})

test('opens, submits and cancels edit dialog with running experiment', () => {
  const experiment = Fixtures.createExperimentFull({ status: Status.Running })
  const { container: _container } = render(<GeneralPanel experiment={experiment} />)

  const editButton = screen.getByRole('button', { name: /Edit/ })
  fireEvent.click(editButton)

  waitFor(() => {
    screen.getByRole('button', { name: /Save/ })
  })

  const saveButton = screen.getByRole('button', { name: /Save/ })
  fireEvent.click(saveButton)

  fireEvent.click(editButton)

  waitFor(() => {
    screen.getByRole('button', { name: /Cancel/ })
  })

  const cancelButton = screen.getByRole('button', { name: /Cancel/ })
  fireEvent.click(cancelButton)
})

test('opens, submits and cancels edit dialog with disabled experiment', () => {
  const experiment = Fixtures.createExperimentFull({ status: Status.Disabled })
  const { container: _container } = render(<GeneralPanel experiment={experiment} />)

  const editButton = screen.getByRole('button', { name: /Edit/ })
  fireEvent.click(editButton)

  waitFor(() => {
    screen.getByRole('button', { name: /Save/ })
  })

  const saveButton = screen.getByRole('button', { name: /Save/ })
  fireEvent.click(saveButton)

  fireEvent.click(editButton)

  waitFor(() => {
    screen.getByRole('button', { name: /Cancel/ })
  })

  const cancelButton = screen.getByRole('button', { name: /Cancel/ })
  fireEvent.click(cancelButton)
})
