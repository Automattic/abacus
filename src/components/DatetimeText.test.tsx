import React from 'react'

import { render } from '@/test-helpers/test-utils'

import DatetimeText from './DatetimeText'

test('renders as ISO 8601 UTC', () => {
  const input = new Date(Date.UTC(2020, 4, 2))
  const { container } = render(<DatetimeText datetime={input} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="makeStyles-root-1"
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
        class="makeStyles-root-2"
        title="01/05/2020, 20:00:00"
      >
        2020-05-02
      </span>
    </div>
  `)
})
