import { Event, ExperimentFull, MetricAssignment, Platform, SegmentAssignment, Variation } from './schemas'
import { formatISODate } from '@/utils/time'

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
    props: Object.entries(exposureEvent.props as object).map(([key, value]) => ({ key, value })),
  }
}

export function experimentToFormData(experiment: Partial<ExperimentFull>) {
  return {
    p2Url: experiment.p2Url ?? '',
    name: experiment.name ?? '',
    description: experiment.description ?? '',
    startDatetime: experiment.startDatetime ? formatISODate(experiment.startDatetime) : '',
    endDatetime: experiment.endDatetime ? formatISODate(experiment.endDatetime) : '',
    ownerLogin: experiment.ownerLogin ?? '',
    existingUsersAllowed: experiment.existingUsersAllowed ?? true,
    platform: experiment.platform ?? Platform.Wpcom,
    metricAssignments: experiment.metricAssignments ? experiment.metricAssignments.map(metricAssignmentToFormData) : [],
    segmentAssignments: experiment.segmentAssignments
      ? experiment.segmentAssignments.map(segmentAssignmentToFormData)
      : [],
    variations: experiment.variations
      ? experiment.variations.map(variationToFormData)
      : [
          { name: 'control', isDefault: true, allocatedPercentage: 50 },
          { name: 'treatment', isDefault: false, allocatedPercentage: 50 },
        ],
    exposureEvents: experiment.exposureEvents ? experiment.exposureEvents.map(exposureEventToFormData) : [],
  }
}
export type ExperimentFormData = ReturnType<typeof experimentToFormData>
