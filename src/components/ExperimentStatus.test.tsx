import React from 'react'

import { Status } from 'src/lib/schemas'
import { render } from 'src/test-helpers/test-utils'

import ExperimentStatus from './ExperimentStatus'

test('renders as completed', () => {
  const { container } = render(<ExperimentStatus status={Status.Completed} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="makeStyles-root-1"
      >
        <span
          class="makeStyles-statusDot-6 makeStyles-completed-2"
        />
         
        completed
      </span>
    </div>
  `)
})

test('renders as disabled', () => {
  const { container } = render(<ExperimentStatus status={Status.Disabled} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="makeStyles-root-7"
      >
        <span
          class="makeStyles-statusDot-12 makeStyles-disabled-11"
        />
         
        disabled
      </span>
    </div>
  `)
})

test('renders as running', () => {
  const { container } = render(<ExperimentStatus status={Status.Running} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="makeStyles-root-13"
      >
        <span
          class="makeStyles-statusDot-18 makeStyles-running-15"
        />
         
        running
      </span>
    </div>
  `)
})

test('renders as staging', () => {
  const { container } = render(<ExperimentStatus status={Status.Staging} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="makeStyles-root-19"
      >
        <span
          class="makeStyles-statusDot-24 makeStyles-staging-22"
        />
         
        staging
      </span>
    </div>
  `)
})
