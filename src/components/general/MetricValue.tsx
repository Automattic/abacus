import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import _, { identity } from 'lodash'
import React from 'react'

import { MetricParameterType } from 'src/lib/schemas'

const useDashedTooltipStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.grey[500],
    },
  }),
)

function DashedTooltip(props: Parameters<typeof Tooltip>[0]) {
  const classes = useDashedTooltipStyles()
  return <Tooltip className={clsx(classes.root, props.className)} {...props} />
}

/**
 * Precision to be inputed into _.round, to be used outside of graphs.
 */
const metricValueFormatPrecision = 2

interface MetricValueFormat {
  unit: React.ReactNode
  prefix: React.ReactNode
  postfix: React.ReactNode
  transform: (n: number) => number
  formatter: (n: number) => string
}

const standardNumberFormatter = (n: number): string => `${_.round(n, metricValueFormatPrecision)}`
const usdFormatter = (n: number): string =>
  n.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })

/**
 * Metric Formatting Data
 */
export const metricValueFormatData: Record<string, MetricValueFormat> = {
  count: {
    unit: '',
    prefix: '',
    postfix: '',
    transform: identity,
    formatter: (n: number): string => n.toLocaleString(undefined),
  },
  conversion: {
    unit: '%',
    prefix: '',
    postfix: '%',
    transform: (x: number): number => x * 100,
    formatter: standardNumberFormatter,
  },
  conversion_difference: {
    unit: 'pp',
    prefix: '',
    postfix: (
      <DashedTooltip title='Percentage points.'>
        <span>pp</span>
      </DashedTooltip>
    ),
    transform: (x: number): number => x * 100,
    formatter: standardNumberFormatter,
  },
  revenue: {
    unit: 'USD',
    prefix: '',
    postfix: <>&nbsp;USD</>,
    transform: identity,
    formatter: usdFormatter,
  },
  revenue_difference: {
    unit: 'USD',
    prefix: '',
    postfix: <>&nbsp;USD</>,
    transform: identity,
    formatter: usdFormatter,
  },
}

export function getMetricValueFormatData({
  metricParameterType,
  isDifference,
}: {
  metricParameterType: MetricParameterType
  isDifference: boolean
}): MetricValueFormat {
  return metricValueFormatData[`${metricParameterType}${isDifference ? '_difference' : ''}`]
}

/**
 * Format a metric value to be used outside of a graph context.
 * @param value The metric value
 * @param metricParameterType
 * @param isDifference Is this an arithmetic difference between metric values
 * @param displayUnit Display the unit
 * @param displayPositiveSign Display the positive sign (+) when a value is positive.
 */
export default function MetricValue({
  value,
  metricParameterType,
  isDifference = false,
  displayUnit = true,
  displayPositiveSign = false,
}: {
  value: number
  metricParameterType: MetricParameterType
  isDifference?: boolean
  displayUnit?: boolean
  displayPositiveSign?: boolean
}): JSX.Element {
  const format = getMetricValueFormatData({ metricParameterType, isDifference })
  return (
    <>
      {displayPositiveSign && 0 <= value && '+'}
      {displayUnit && format.prefix}
      {format.formatter(format.transform(value))}
      {displayUnit && format.postfix}
    </>
  )
}
