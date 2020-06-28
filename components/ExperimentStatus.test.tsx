import { render } from '@testing-library/react'
import React from 'react'

import { Status } from '@/models'

import ExperimentStatus from './ExperimentStatus'

test('renders as completed', () => {
  const { container } = render(<ExperimentStatus status={Status.Completed} />)

  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="MuiTypography-root makeStyles-root-1 makeStyles-completed-2 MuiTypography-caption"
      >
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
        class="MuiTypography-root makeStyles-root-6 makeStyles-disabled-10 MuiTypography-caption"
      >
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
        class="MuiTypography-root makeStyles-root-11 makeStyles-running-13 MuiTypography-caption"
      >
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
        class="MuiTypography-root makeStyles-root-16 makeStyles-staging-19 MuiTypography-caption"
      >
        staging
      </span>
    </div>
  `)
})
