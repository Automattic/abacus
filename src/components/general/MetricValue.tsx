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

/**
 * Metric Formatting Data
 */
const metricValueFormatData: Record<
  string,
  { prefix: React.ReactNode; postfix: React.ReactNode; transform: (v: number) => number }
> = {
  conversion: {
    prefix: '',
    postfix: '%',
    transform: (x: number): number => x * 100,
  },
  conversion_difference: {
    prefix: '',
    postfix: (
      <DashedTooltip title='Percentage points.'>
        <span>pp</span>
      </DashedTooltip>
    ),
    transform: (x: number): number => x * 100,
  },
  revenue: {
    prefix: <>USD&nbsp;</>,
    postfix: '',
    transform: identity,
  },
  revenue_difference: {
    prefix: <>USD&nbsp;</>,
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
export default function MetricValue({
  value,
  metricParameterType,
  isDifference = false,
}: {
  value: number
  metricParameterType: MetricParameterType
  isDifference?: boolean
}): JSX.Element {
  const format = metricValueFormatData[`${metricParameterType}${isDifference ? '_difference' : ''}`]
  return (
    <>
      {format.prefix}
      {_.round(format.transform(value), metricValueFormatPrecision)}
      {format.postfix}
    </>
  )
}
