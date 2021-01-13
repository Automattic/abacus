import _, { identity } from 'lodash'

import { MetricParameterType } from 'src/lib/schemas'

/**
 * Formats the boolean as Yes or No.
 */
export function formatBoolean(bool: boolean): 'Yes' | 'No' {
  return bool ? 'Yes' : 'No'
}

/**
 * Precision to be inputed into _.round, to be used outside of graphs.
 */
export const metricValueFormatPrecision = 4

/**
 * Metric Formatting Data
 */
export const metricValueFormatData: Record<
  string,
  { prefix: string; postfix: string; transform: (v: number) => number }
> = {
  conversion: {
    prefix: '',
    postfix: '%',
    transform: (x: number): number => x * 100,
  },
  conversion_difference: {
    prefix: '',
    postfix: ' percentage points',
    transform: (x: number): number => x * 100,
  },
  revenue: {
    prefix: '$',
    postfix: '',
    transform: identity,
  },
  revenue_difference: {
    prefix: '$',
    postfix: '',
    transform: identity,
  },
}

/**
 * Format a metric value to be used outside of a graph context.
 * @param value The metric value
 * @param metricParameterType
 * @param isDifference Is this an arithmetic difference between metric values
 */
export function formatMetricValue(
  value: number,
  metricParameterType: MetricParameterType,
  isDifference?: boolean,
): string {
  const format = metricValueFormatData[`${metricParameterType}${isDifference ? '_difference' : ''}`]
  return `${format.prefix}${_.round(format.transform(value), metricValueFormatPrecision)}${format.postfix}`
}
