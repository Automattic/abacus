import { render } from '@testing-library/react'
import React from 'react'

import DatetimeText from './DatetimeText'

test('renders as ISO 8601 UTC', () => {
  const input = new Date(Date.UTC(2020, 4, 2))
  const { container } = render(<DatetimeText datetime={input} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="datetime-text"
        title="01/05/2020, 20:00:00"
      >
        2020-05-02T00:00:00.000Z
      </span>
    </div>
  `)
})

test('renders as ISO 8601 UTC without time', () => {
  const input = new Date(Date.UTC(2020, 4, 2))
  const { container } = render(<DatetimeText datetime={input} excludeTime />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="datetime-text"
        title="01/05/2020, 20:00:00"
      >
        2020-05-02
      </span>
    </div>
  `)
})
