import React from 'react'

import { render } from '@/helpers/test-utils'

import LabelValuePanel from './LabelValuePanel'

test('renders labels and values', () => {
  const data = [
    { label: 'String', value: 'string' },
    { label: 'HTML', value: <span>React Element</span> },
  ]
  const { container } = render(<LabelValuePanel data={data} title='Foo Bar' />)

  // Expect that a title and two label/value pairs are rendered.
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <h3
          class="MuiTypography-root makeStyles-title-1 MuiTypography-h3 MuiTypography-colorTextPrimary"
        >
          Foo Bar
        </h3>
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
                String
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                string
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
                HTML
              </th>
              <td
                class="MuiTableCell-root MuiTableCell-body"
              >
                <span>
                  React Element
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})
