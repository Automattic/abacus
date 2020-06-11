import React from 'react'

import { AttributionWindowSeconds } from '@/models'

const TRANSLATION_TABLE = {
  [AttributionWindowSeconds.OneHour]: '1 hour',
  [AttributionWindowSeconds.SixHours]: '6 hours',
  [AttributionWindowSeconds.TwelveHours]: '12 hours',
  [AttributionWindowSeconds.TwentyFourHours]: '24 hours',
  [AttributionWindowSeconds.ThreeDays]: '3 days',
  [AttributionWindowSeconds.OneWeek]: '1 week',
  [AttributionWindowSeconds.TwoWeeks]: '2 weeks',
  [AttributionWindowSeconds.ThreeWeeks]: '3 weeks',
  [AttributionWindowSeconds.FourWeeks]: '4 weeks',
}

/**
 * Renders the attribution window in concise, human readable text.
 */
const AttributionWindow = (props: { attributionWindowSeconds: AttributionWindowSeconds }) => {
  return <span>{TRANSLATION_TABLE[props.attributionWindowSeconds]}</span>
}

export default AttributionWindow
