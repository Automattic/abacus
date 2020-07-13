import { AttributionWindowSeconds } from './schemas'

const AttributionWindowSecondsToHuman = {
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

export const attributionWindowSecondsToHuman = (seconds: AttributionWindowSeconds): string => {
  return AttributionWindowSecondsToHuman[seconds]
}
