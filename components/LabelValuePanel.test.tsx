import { render } from '@testing-library/react'
import React from 'react'

import LabelValuePanel from './LabelValuePanel'

test('renders labels and values', () => {
  const data = [
    { label: 'String', value: 'string' },
    { label: 'HTML', value: <span>HTML span</span> },
  ]
  const { container } = render(<LabelValuePanel data={data} title='Foo Bar' />)

  // Expect that a title and two label/value pairs are rendered.
  expect(container).toMatchInlineSnapshot(`
    <div>
      <div
        class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
      >
        <table
          class="MuiTable-root"
        >
          <thead
            class="MuiTableHead-root"
          >
            <tr
              class="MuiTableRow-root MuiTableRow-head"
            >
              <th
                class="MuiTableCell-root MuiTableCell-head"
                colspan="2"
                scope="col"
              >
                <h3
                  class="MuiTypography-root MuiTypography-h3 MuiTypography-colorTextPrimary"
                >
                  Foo Bar
                </h3>
              </th>
            </tr>
          </thead>
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
                  HTML span
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `)
})
