import { normalize, schema } from 'normalizr'

import { MetricBare, MetricFull, Segment } from './schemas'

export const metricNormalizrSchema = new schema.Entity<MetricBare | MetricFull>(
  'metrics',
  {},
  { idAttribute: 'metricId' },
)
export function indexMetrics<Metric extends MetricBare | MetricFull>(metrics: Metric[]): Record<number, Metric> {
  const {
    entities: { metrics: indexedMetrics },
  } = normalize<Metric>(metrics, [metricNormalizrSchema])
  if (!indexedMetrics) {
    return {}
  }
  return indexedMetrics
}

export const segmentNormalizrSchema = new schema.Entity<Segment>('segments', {}, { idAttribute: 'segmentId' })
export function indexSegments(segments: Segment[]): Record<number, Segment> {
  const {
    entities: { segments: indexedSegments },
  } = normalize<Segment>(segments, [segmentNormalizrSchema])
  if (!indexedSegments) {
    return {}
  }
  return indexedSegments
}
