import { normalize, schema } from 'normalizr'

import { MetricBare, MetricFull, Segment } from './schemas'

export const metricBareNormalizrSchema = new schema.Entity<MetricBare>('metrics', {}, { idAttribute: 'metricId' })
export function indexMetrics<Metric extends MetricBare | MetricFull>(metrics: Metric[]) {
  const {
    entities: { metrics: indexedMetrics },
  } = normalize<Metric>(metrics, [metricBareNormalizrSchema])
  /* istanbul ignore next */
  if (!indexedMetrics) {
    throw new Error(`No metrics produced after normalisation, this should never happen.`)
  }
  return indexedMetrics
}

export const segmentNormalizrSchema = new schema.Entity<Segment>('segments', {}, { idAttribute: 'segmentId' })
export function indexSegments(segments: Segment[]) {
  const {
    entities: { segments: indexedSegments },
  } = normalize<Segment>(segments, [segmentNormalizrSchema])
  /* istanbul ignore next */
  if (!indexedSegments) {
    throw new Error(`No segments produced after normalisation, this should never happen.`)
  }
  return indexedSegments
}
