import { fireEvent, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react'
import { noop } from 'lodash'
import * as notistack from 'notistack'
import React from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import Fixtures from '@/test-helpers/fixtures'
import { changeFieldByRole, render } from '@/test-helpers/test-utils'

import ConclusionsPanel from './ConclusionsPanel'

jest.mock('notistack')
const mockedNotistack = notistack as jest.Mocked<typeof notistack>
mockedNotistack.useSnackbar.mockImplementation(() => ({
  enqueueSnackbar: jest.fn(),
  closeSnackbar: jest.fn(),
}))

jest.mock('@/api/ExperimentsApi')
const mockedExperimentsApi = ExperimentsApi as jest.Mocked<typeof ExperimentsApi>

const experimentReloadRef: React.MutableRefObject<() => void> = { current: noop }

test('renders as expected with complete conclusion data', () => {
  const experiment = Fixtures.createExperimentFull({
    conclusionUrl: 'https://betterexperiments.wordpress.com/experiment_1/conclusion',
    deployedVariationId: 2,
    endReason: 'Ran its course.',
  })
  const { container } = render(<ConclusionsPanel experiment={experiment} experimentReloadRef={experimentReloadRef} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <div
          class="MuiToolbar-root MuiToolbar-regular MuiToolbar-gutters"
        >
          <h3
            class="MuiTypography-root makeStyles-title-1 MuiTypography-h3 MuiTypography-colorTextPrimary"
          >
            Conclusions
          </h3>
          <button
            aria-label="Edit Conclusion"
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
                Reason the experiment ended
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Ran its course.
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
                Conclusion URL
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <a
                  href="https://betterexperiments.wordpress.com/experiment_1/conclusion"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://betterexperiments.wordpress.com/experiment_1/conclusion
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
                Deployed variation
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                test
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})

test('renders as expected without deployed variation', () => {
  const experiment = Fixtures.createExperimentFull({
    conclusionUrl: 'https://betterexperiments.wordpress.com/experiment_1/conclusion',
    deployedVariationId: null,
    endReason: 'Ran its course.',
  })
  const { container } = render(<ConclusionsPanel experiment={experiment} experimentReloadRef={experimentReloadRef} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <div
          class="MuiToolbar-root MuiToolbar-regular MuiToolbar-gutters"
        >
          <h3
            class="MuiTypography-root makeStyles-title-3 MuiTypography-h3 MuiTypography-colorTextPrimary"
          >
            Conclusions
          </h3>
          <button
            aria-label="Edit Conclusion"
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
                Reason the experiment ended
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                Ran its course.
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
                Conclusion URL
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <a
                  href="https://betterexperiments.wordpress.com/experiment_1/conclusion"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  https://betterexperiments.wordpress.com/experiment_1/conclusion
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
                Deployed variation
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})

const queryEditDialog = () => screen.queryByRole('heading', { name: /Edit Experiment: Conclusions/ })

test('opens and saves edit dialog', async () => {
  const experiment = Fixtures.createExperimentFull()
  render(<ConclusionsPanel experiment={experiment} experimentReloadRef={experimentReloadRef} />)
  mockedExperimentsApi.patch.mockClear().mockReset()
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/require-await
  mockedExperimentsApi.patch.mockImplementation(async () => experiment)

  // First round: Save empty form.
  fireEvent.click(screen.getByRole('button', { name: /Edit/ }))
  await waitFor(queryEditDialog)
  fireEvent.click(screen.getByRole('button', { name: /Save/ }))
  await waitForElementToBeRemoved(queryEditDialog)
  expect(mockedExperimentsApi.patch).toHaveBeenCalledTimes(1)
  expect(mockedExperimentsApi.patch).toHaveBeenLastCalledWith(1, { endReason: '' })

  // Second round: Add some details.
  mockedExperimentsApi.patch.mockClear()
  fireEvent.click(screen.getByRole('button', { name: /Edit/ }))
  await waitFor(queryEditDialog)
  await changeFieldByRole('textbox', /Reason/, 'The experiment ended')
  await changeFieldByRole('textbox', /Conclusion/, 'https://www.conclusions.com/')
  fireEvent.click(screen.getByLabelText(/test/))
  fireEvent.click(screen.getByRole('button', { name: /Save/ }))
  await waitForElementToBeRemoved(queryEditDialog)
  expect(mockedExperimentsApi.patch).toHaveBeenCalledTimes(1)
  expect(mockedExperimentsApi.patch).toHaveBeenLastCalledWith(1, {
    conclusionUrl: 'https://www.conclusions.com/',
    deployedVariationId: 2,
    endReason: 'The experiment ended',
  })
})

test('opens and cancels edit dialog', async () => {
  const experiment = Fixtures.createExperimentFull()
  render(<ConclusionsPanel experiment={experiment} experimentReloadRef={experimentReloadRef} />)

  fireEvent.click(screen.getByRole('button', { name: /Edit/ }))
  await waitFor(queryEditDialog)
  fireEvent.click(screen.getByRole('button', { name: /Cancel/ }))
  await waitForElementToBeRemoved(queryEditDialog)
})
