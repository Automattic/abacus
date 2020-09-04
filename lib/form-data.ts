import { MetricAssignment, SegmentAssignment, Variation, ExperimentFull, Event } from './schemas'
import { format } from 'date-fns'

function metricAssignmentToFormData(metricAssignment: MetricAssignment) {
  return {
    metricId: String(metricAssignment.metricId),
    attributionWindowSeconds: String(metricAssignment.attributionWindowSeconds),
    isPrimary: metricAssignment.isPrimary,
    changeExpected: metricAssignment.changeExpected,
    minDifference: String(metricAssignment.minDifference),
  }
}

function segmentAssignmentToFormData(segmentAssignment: SegmentAssignment) {
  return {
    segmentId: segmentAssignment.segmentId,
    isExcluded: segmentAssignment.isExcluded,
  }
}

function variationToFormData(variation: Variation) {
  return {
    name: variation.name,
    isDefault: variation.isDefault,
    allocatedPercentage: String(variation.allocatedPercentage),
  }
}

function exposureEventToFormData(exposureEvent: Event) {
  return {
    event: exposureEvent.event,
    props: Object.entries(exposureEvent.props as object).map(([key, value]) => ({ key, value }))
  }
}

export function experimentToFormData(experiment: ExperimentFull) {
  return {
    p2Url: experiment.p2Url,
    name: experiment.name,
    description: experiment.description,
    startDatetime: format(experiment.startDatetime, 'yyyy-MM-dd'),
    endDatetime: format(experiment.endDatetime, 'yyyy-MM-dd'),
    ownerLogin: experiment.ownerLogin,
    existingUsersAllowed: String(experiment.existingUsersAllowed),
    platform: experiment.platform,
    metricAssignments: experiment.metricAssignments.map(metricAssignmentToFormData),
    segmentAssignments: experiment.segmentAssignments.map(segmentAssignmentToFormData),
    variations: experiment.variations.map(variationToFormData),
    exposureEvents: (experiment.exposureEvents || []).map(exposureEventToFormData),
  }
}