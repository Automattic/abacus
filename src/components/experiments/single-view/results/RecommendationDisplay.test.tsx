import React from 'react'

import { Decision } from 'src/lib/recommendations'
import { AnalysisStrategy } from 'src/lib/schemas'
import Fixtures from 'src/test-helpers/fixtures'
import { render } from 'src/test-helpers/test-utils'

import RecommendationDisplay from './RecommendationDisplay'

test('renders MissingAnalysis correctly', () => {
  const { container } = render(
    <RecommendationDisplay
      recommendation={{
        analysisStrategy: AnalysisStrategy.PpNaive,
        decision: Decision.MissingAnalysis,
      }}
      experiment={Fixtures.createExperimentFull()}
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
    <RecommendationDisplay
      recommendation={{
        analysisStrategy: AnalysisStrategy.PpNaive,
        decision: Decision.ManualAnalysisRequired,
      }}
      experiment={Fixtures.createExperimentFull()}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      <span
        class="makeStyles-tooltipped-2"
        title="Contact @experimentation-review on #a8c-experiments"
      >
        Manual analysis required
      </span>
    </div>
  `)
})

test('renders Inconclusive correctly', () => {
  const { container } = render(
    <RecommendationDisplay
      recommendation={{
        analysisStrategy: AnalysisStrategy.PpNaive,
        decision: Decision.Inconclusive,
      }}
      experiment={Fixtures.createExperimentFull()}
    />,
  )
  expect(container).toMatchInlineSnapshot(`
    <div>
      Inconclusive
    </div>
  `)
})

test('renders DeployAnyVariation correctly', () => {
  const { container } = render(
    <RecommendationDisplay
      recommendation={{
        analysisStrategy: AnalysisStrategy.PpNaive,
        decision: Decision.DeployAnyVariation,
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
    <RecommendationDisplay
      recommendation={{
        analysisStrategy: AnalysisStrategy.PpNaive,
        decision: Decision.DeployChosenVariation,
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
      <RecommendationDisplay
        recommendation={{
          analysisStrategy: AnalysisStrategy.PpNaive,
          decision: Decision.DeployChosenVariation,
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

test('throws error for uncovered Recommendation', () => {
  // Prevent an uncaught error warning due to React + TestingLibrary
  const originalConsoleError = console.error
  console.error = jest.fn()
  expect(() =>
    render(
      <RecommendationDisplay
        recommendation={{
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          decision: 'Unknown Decision',
          chosenVariationId: 123,
        }}
        experiment={Fixtures.createExperimentFull({
          variations: [],
        })}
      />,
    ),
  ).toThrowErrorMatchingInlineSnapshot(`"Missing Decision."`)
  console.error = originalConsoleError
})
