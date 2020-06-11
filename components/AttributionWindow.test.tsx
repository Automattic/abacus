import { render } from '@testing-library/react'
import React from 'react'

import { AttributionWindowSeconds } from '@/models'

import AttributionWindow from './AttributionWindow'

test('with `OneHour` renders expected text', () => {
  const { getByText } = render(<AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.OneHour} />)
  expect(getByText('1 hour')).toBeInTheDocument()
})

test('with `SixHours` renders expected text', () => {
  const { getByText } = render(<AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.SixHours} />)
  expect(getByText('6 hours')).toBeInTheDocument()
})

test('with `TwelveHours` renders expected text', () => {
  const { getByText } = render(<AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.TwelveHours} />)
  expect(getByText('12 hours')).toBeInTheDocument()
})

test('with `TwentyFourHours` renders expected text', () => {
  const { getByText } = render(
    <AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.TwentyFourHours} />,
  )
  expect(getByText('24 hours')).toBeInTheDocument()
})

test('with `ThreeDays` renders expected text', () => {
  const { getByText } = render(<AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.ThreeDays} />)
  expect(getByText('3 days')).toBeInTheDocument()
})

test('with `OneWeek` renders expected text', () => {
  const { getByText } = render(<AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.OneWeek} />)
  expect(getByText('1 week')).toBeInTheDocument()
})

test('with `TwoWeeks` renders expected text', () => {
  const { getByText } = render(<AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.TwoWeeks} />)
  expect(getByText('2 weeks')).toBeInTheDocument()
})

test('with `ThreeWeeks` renders expected text', () => {
  const { getByText } = render(<AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.ThreeWeeks} />)
  expect(getByText('3 weeks')).toBeInTheDocument()
})

test('with `FourWeeks` renders expected text', () => {
  const { getByText } = render(<AttributionWindow attributionWindowSeconds={AttributionWindowSeconds.FourWeeks} />)
  expect(getByText('4 weeks')).toBeInTheDocument()
})
