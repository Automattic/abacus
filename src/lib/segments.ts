import { SegmentType } from './schemas'

export const SegmentTypeToHuman: Record<SegmentType, string> = {
  [SegmentType.Country]: 'Country',
  [SegmentType.Locale]: 'Locale',
}
