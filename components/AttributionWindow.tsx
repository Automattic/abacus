import React from 'react'

import { AttributionWindowSeconds } from '@/models'

const TRANSLATION_TABLE = {
  [AttributionWindowSeconds.FourWeeks]: '4 weeks',
  [AttributionWindowSeconds.OneHour]: '1 hour',
  [AttributionWindowSeconds.OneWeek]: '1 week',
  [AttributionWindowSeconds.SixHours]: '6 hours',
  [AttributionWindowSeconds.ThreeDays]: '3 days',
  [AttributionWindowSeconds.ThreeWeeks]: '3 weeks',
  [AttributionWindowSeconds.TwelveHours]: '12 hours',
  [AttributionWindowSeconds.TwentyFourHours]: '24 hours',
  [AttributionWindowSeconds.TwoWeeks]: '2 weeks',
}

interface Props {
  attributionWindowSeconds: AttributionWindowSeconds
}

/**
 * Renders the attribution window in concise, human readable text.
 */
const AttributionWindow = (props: Props) => {
  return <span>{TRANSLATION_TABLE[props.attributionWindowSeconds]}</span>
}

export default AttributionWindow
