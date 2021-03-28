import React from 'react'

import { AggregateRecommendationDecision } from 'src/lib/analyses'
import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

import AggregateRecommendationDisplay from './AggregateRecommendationDisplay'

test('renders MissingAnalysis correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        decision: AggregateRecommendationDecision.MissingAnalysis,
      }}
      experiment={Fixtures.createExperimentFull()}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="makeStyles-tooltipped-1"
        title="It takes 24-48 hours for data to be analyzed."
      >
         Not analyzed yet 
      </span>
    </div>
  `)
})

test('renders ManualAnalysisRequired correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        decision: AggregateRecommendationDecision.ManualAnalysisRequired,
      }}
      experiment={Fixtures.createExperimentFull()}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="makeStyles-tooltipped-2"
        title="Contact @experimentation-review on #a8c-experiments."
      >
        Manual analysis required
      </span>
    </div>
  `)
})

test('renders TooShort correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        decision: AggregateRecommendationDecision.MoreDataNeeded,
      }}
      experiment={Fixtures.createExperimentFull()}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      More data needed
    </div>
  `)
})

test('renders DeployAnyVariation correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        decision: AggregateRecommendationDecision.DeployAnyVariation,
      }}
      experiment={Fixtures.createExperimentFull()}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      Deploy either variation
    </div>
  `)
})

test('renders DeployAnyVariation correctly with stopping recommendation', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        decision: AggregateRecommendationDecision.DeployAnyVariation,
        shouldStop: true,
      }}
      experiment={Fixtures.createExperimentFull()}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      Deploy either variation
    </div>
  `)
})

test('renders DeployChosenVariation correctly', () => {
  const { container } = render(
    <AggregateRecommendationDisplay
      aggregateRecommendation={{
        decision: AggregateRecommendationDecision.DeployChosenVariation,
        chosenVariationId: 123,
      }}
      experiment={Fixtures.createExperimentFull({
        variations: [
          {
            variationId: 123,
            name: 'variation_name_123',
            allocatedPercentage: 1,
            isDefault: false,
          },
        ],
      })}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
       Deploy 
      variation_name_123
       
    </div>
  `)
})

test('throws error for missing chosenVariationId', () => {
  // Prevent an uncaught error warning due to React + TestingLibrary
  const originalConsoleError = console.error
  console.error = jest.fn()
  expect(() =>
    render(
      <AggregateRecommendationDisplay
        aggregateRecommendation={{
          decision: AggregateRecommendationDecision.DeployChosenVariation,
          chosenVariationId: 123,
        }}
        experiment={Fixtures.createExperimentFull({
          variations: [],
        })}
      />,
    ),
  ).toThrowErrorMatchingInlineSnapshot(`"No match for chosenVariationId among variations in experiment."`)
  console.error = originalConsoleError
})

test('throws error for uncovered AggregateRecommendation', () => {
  // Prevent an uncaught error warning due to React + TestingLibrary
  const originalConsoleError = console.error
  console.error = jest.fn()
  expect(() =>
    render(
      <AggregateRecommendationDisplay
        aggregateRecommendation={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          decision: 'Unknown AggregateRecommendationDecision',
          chosenVariationId: 123,
        }}
        experiment={Fixtures.createExperimentFull({
          variations: [],
        })}
      />,
    ),
  ).toThrowErrorMatchingInlineSnapshot(
    `"Missing AggregateRecommendationDecision: Unknown AggregateRecommendationDecision."`,
  )
  console.error = originalConsoleError
})
