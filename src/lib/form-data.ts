import { formatIsoDate } from 'src/utils/time'

import {
  Event,
  ExperimentFull,
  MetricAssignment,
  MetricFull,
  MetricParameterType,
  Platform,
  SegmentAssignment,
  Variation,
} from './schemas'

interface MetricAssignmentFormData {
  attributionWindowSeconds: string
  changeExpected: boolean
  metricId: string
  isPrimary: boolean
  minDifference: string
}

interface SegmentAssignmentFormData {
  isExcluded: boolean
  segmentId: number
}

interface VariationFormData {
  allocatedPercentage: string
  isDefault: boolean
  name: string
}

interface ExposureEventFormData {
  event: string
  props: { value: unknown; key: string }[]
}

function metricAssignmentToFormData(metricAssignment: MetricAssignment): MetricAssignmentFormData {
  return {
    metricId: String(metricAssignment.metricId),
    attributionWindowSeconds: String(metricAssignment.attributionWindowSeconds),
    isPrimary: metricAssignment.isPrimary,
    changeExpected: metricAssignment.changeExpected,
    minDifference: String(metricAssignment.minDifference),
  }
}

function segmentAssignmentToFormData(segmentAssignment: SegmentAssignment): SegmentAssignmentFormData {
  return {
    segmentId: segmentAssignment.segmentId,
    isExcluded: segmentAssignment.isExcluded,
  }
}

function variationToFormData(variation: Variation): VariationFormData {
  return {
    name: variation.name,
    isDefault: variation.isDefault,
    allocatedPercentage: String(variation.allocatedPercentage),
  }
}

function exposureEventToFormData(exposureEvent: Event): ExposureEventFormData {
  return {
    event: exposureEvent.event,
    props: Object.entries(exposureEvent.props as Record<string, unknown>).map(([key, value]) => ({ key, value })),
  }
}

/**
 * Takes an experiment object and formats it for use as form-data in ExperimentForm.
 */
export function experimentToFormData(
  experiment: Partial<ExperimentFull>,
): {
  startDatetime: string
  variations: VariationFormData[]
  segmentAssignments: SegmentAssignmentFormData[]
  name: string
  description: string
  metricAssignments: MetricAssignmentFormData[]
  exposureEvents: ExposureEventFormData[]
  existingUsersAllowed: 'true' | 'false'
  endDatetime: string
  platform: string
  p2Url: string
  ownerLogin: string
} {
  return {
    p2Url: experiment.p2Url ?? '',
    name: experiment.name ?? '',
    description: experiment.description ?? '',
    startDatetime: experiment.startDatetime ? formatIsoDate(experiment.startDatetime) : '',
    endDatetime: experiment.endDatetime ? formatIsoDate(experiment.endDatetime) : '',
    ownerLogin: experiment.ownerLogin ?? '',
    existingUsersAllowed:
      experiment.existingUsersAllowed === undefined
        ? 'true'
        : (String(experiment.existingUsersAllowed) as 'true' | 'false'),
    platform: experiment.platform ?? Platform.Wpcom,
    metricAssignments: experiment.metricAssignments ? experiment.metricAssignments.map(metricAssignmentToFormData) : [],
    segmentAssignments: experiment.segmentAssignments
      ? experiment.segmentAssignments.map(segmentAssignmentToFormData)
      : [],
    variations: experiment.variations
      ? experiment.variations.map(variationToFormData)
      : [
          { name: 'control', isDefault: true, allocatedPercentage: '50' },
          { name: 'treatment', isDefault: false, allocatedPercentage: '50' },
        ],
    exposureEvents: experiment.exposureEvents ? experiment.exposureEvents.map(exposureEventToFormData) : [],
  }
}
export type ExperimentFormData = ReturnType<typeof experimentToFormData>

/**
 * Convert a metric for use as form data in Formik.
 */
export const metricToFormData: (
  metric: Partial<MetricFull>,
) => {
  parameterType: MetricParameterType
  name: string
  eventParams: string | undefined
  description: string
  revenueParams: string | undefined
  higherIsBetter: boolean
} = (metric: Partial<MetricFull>) => ({
  name: metric.name ?? '',
  description: metric.description ?? '',
  parameterType: metric.parameterType ?? MetricParameterType.Conversion,
  higherIsBetter: metric.higherIsBetter ?? true,
  eventParams: metric.eventParams ? JSON.stringify(metric.eventParams, null, 2) : undefined,
  revenueParams: metric.revenueParams ? JSON.stringify(metric.revenueParams, null, 2) : undefined,
})
export type MetricFormData = ReturnType<typeof metricToFormData>
