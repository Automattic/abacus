import React from 'react'

import { render } from '@/test-helpers/test-utils'

import LabelValueTable from './LabelValueTable'

test('renders labels and values', () => {
  const data = [
    { label: 'String', value: 'string' },
    { label: 'HTML', value: <span>React Element</span> },
  ]
  const { container } = render(<LabelValueTable data={data} />)

  // Expect that a title and two label/value pairs are rendered.
  expect(container).toMatchInlineSnapshot(`
    <div>
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
  `)
})
