/* eslint-disable @typescript-eslint/require-await */
import { act, fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { noop } from 'lodash'
import MockDate from 'mockdate'
import * as notistack from 'notistack'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import { Status } from '@/lib/schemas'
import Fixtures from '@/test-helpers/fixtures'
import { changeFieldByRole, render } from '@/test-helpers/test-utils'

import GeneralPanel from './GeneralPanel'

MockDate.set('2020-07-21')

jest.mock('@/api/ExperimentsApi')
const mockedExperimentsApi = ExperimentsApi as jest.Mocked<typeof ExperimentsApi>

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

const experimentReloadRef: React.MutableRefObject<() => void> = { current: noop }

test('renders as expected', () => {
  const experiment = Fixtures.createExperimentFull()
  const { container } = render(<GeneralPanel experiment={experiment} experimentReloadRef={experimentReloadRef} />)

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
          <div
            class=""
            title="Use \\"Edit in Wizard\\" for staging experiments."
          >
            <button
              aria-label="Edit Experiment General Data"
              class="MuiButtonBase-root MuiButton-root MuiButton-outlined Mui-disabled Mui-disabled"
              disabled=""
              tabindex="-1"
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
            </button>
          </div>
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
                Status
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span
                  class="makeStyles-root-6"
                >
                  <span
                    class="makeStyles-statusDot-11 makeStyles-staging-9"
                  />
                   
                  staging
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
                Dates
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span
                  class="makeStyles-root-12"
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
                  class="makeStyles-root-12"
                  title="20/11/2020, 19:00:00"
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
                Description
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span
                  class="makeStyles-monospace-5"
                >
                  Experiment with things. Change stuff. Profit.
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
                <span
                  class="makeStyles-monospace-5"
                >
                  test_a11n
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
                P2 Link
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <a
                  class="MuiTypography-root MuiLink-root MuiLink-underlineHover makeStyles-monospace-5 MuiTypography-colorPrimary"
                  href="https://wordpress.com/experiment_1"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://wordpress.com/experiment_1
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})

test('opens, submits and cancels edit dialog with running experiment', async () => {
  const experiment = Fixtures.createExperimentFull({ status: Status.Running })
  render(<GeneralPanel experiment={experiment} experimentReloadRef={experimentReloadRef} />)

  mockedExperimentsApi.patch.mockReset()
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  mockedExperimentsApi.patch.mockImplementationOnce(async () => experiment)

  const editButton = screen.getByRole('button', { name: /Edit/ })
  fireEvent.click(editButton)

  await waitFor(() => screen.getByRole('button', { name: /Save/ }))

  changeFieldByRole('textbox', /Experiment description/, 'Edited description.')
  // This date was picked as it is after the fixture start date.
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/End date/), { target: { value: '2020-10-20' } })
  })
  changeFieldByRole('textbox', /Owner/, 'changed_test_a11n')

  const saveButton = screen.getByRole('button', { name: /Save/ })
  fireEvent.click(saveButton)
  await waitForElementToBeRemoved(saveButton)

  expect(mockedExperimentsApi.patch).toHaveBeenCalledTimes(1)
  expect(mockedExperimentsApi.patch).toMatchInlineSnapshot(`
    [MockFunction] {
      "calls": Array [
        Array [
          1,
          Object {
            "description": "Edited description.",
            "endDatetime": "2020-10-20",
            "ownerLogin": "changed_test_a11n",
          },
        ],
      ],
      "results": Array [
        Object {
          "type": "return",
          "value": Promise {},
        },
      ],
    }
  `)

  fireEvent.click(editButton)

  await waitFor(() => screen.getByRole('button', { name: /Cancel/ }))

  const cancelButton = screen.getByRole('button', { name: /Cancel/ })
  fireEvent.click(cancelButton)
  await waitForElementToBeRemoved(cancelButton)

  expect(mockedExperimentsApi.patch).toHaveBeenCalledTimes(1)
})

test('checks edit dialog does not allow end datetime changes with disabled experiment', async () => {
  const experiment = Fixtures.createExperimentFull({ status: Status.Disabled })
  render(<GeneralPanel experiment={experiment} experimentReloadRef={experimentReloadRef} />)

  mockedExperimentsApi.patch.mockReset()
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  mockedExperimentsApi.patch.mockImplementationOnce(async () => experiment)

  const editButton = screen.getByRole('button', { name: /Edit/ })
  fireEvent.click(editButton)

  await waitFor(() => screen.getByRole('button', { name: /Save/ }))

  changeFieldByRole('textbox', /Experiment description/, 'Edited description.')
  expect(screen.getByLabelText(/End date/)).toBeDisabled()
  changeFieldByRole('textbox', /Owner/, 'changed_test_a11n')

  const saveButton = screen.getByRole('button', { name: /Save/ })
  fireEvent.click(saveButton)
  await waitForElementToBeRemoved(saveButton)

  expect(mockedExperimentsApi.patch).toHaveBeenCalledTimes(1)
  expect(mockedExperimentsApi.patch).toMatchInlineSnapshot(`
    [MockFunction] {
      "calls": Array [
        Array [
          1,
          Object {
            "description": "Edited description.",
            "ownerLogin": "changed_test_a11n",
          },
        ],
      ],
      "results": Array [
        Object {
          "type": "return",
          "value": Promise {},
        },
      ],
    }
  `)
})
