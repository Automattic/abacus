import { normalize, schema } from 'normalizr'

import { Metric, Segment, TagBare } from './schemas'

const metricNormalizrSchema = new schema.Entity<Metric>('metrics', {}, { idAttribute: 'metricId' })

/**
 * Return a mapping from metric ID to the metric object.
 */
export function indexMetrics(metrics: Metric[]): Record<number, Metric> {
  return normalize<Metric>(metrics, [metricNormalizrSchema]).entities.metrics || {}
}

const segmentNormalizrSchema = new schema.Entity<Segment>('segments', {}, { idAttribute: 'segmentId' })

/**
 * Return a mapping from segment ID to the segment object.
 */
export function indexSegments(segments: Segment[]): Record<number, Segment> {
  return normalize<Segment>(segments, [segmentNormalizrSchema]).entities.segments || {}
}

const tagNormalizrSchema = new schema.Entity<TagBare>('tags', {}, { idAttribute: 'tagId' })

/**
 * Return a mapping from tag ID to the tag object.
 */
export function indexTags(tags: TagBare[]): Record<number, TagBare> {
  return normalize<TagBare>(tags, [tagNormalizrSchema]).entities.tags || {}
}
