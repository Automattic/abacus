/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react'

import { AggregateRecommendationType } from 'src/lib/analyses'
import { render } from 'src/test-helpers/test-utils'

import AggregateRecommendationDisplay from './AggregateRecommendationDisplay'

test('renders NotAnalyzedYet correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        type: AggregateRecommendationType.NotAnalyzedYet,
      }}
      // @ts-ignore
      experiment={{}}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      Not analyzed yet
    </div>
  `)
})

test('renders ManualAnalysisRequired correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        type: AggregateRecommendationType.ManualAnalysisRequired,
      }}
      // @ts-ignore
      experiment={{}}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      Manual analysis required
    </div>
  `)
})

test('renders Inconclusive correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        type: AggregateRecommendationType.Inconclusive,
      }}
      // @ts-ignore
      experiment={{}}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      Inconclusive
    </div>
  `)
})

test('renders DeployEither correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        type: AggregateRecommendationType.DeployEither,
      }}
      // @ts-ignore
      experiment={{}}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      Deploy either variation
    </div>
  `)
})

test('renders Deploy correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        type: AggregateRecommendationType.Deploy,
        variationId: 123,
      }}
      // @ts-ignore
      experiment={{ variations: [{ variationId: 123, name: 'variation_name_123' }] }}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      Deploy 
      variation_name_123
    </div>
  `)
})
