import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

import MetricValue, { getMetricValueFormatData } from 'src/components/general/MetricValue'
import { MetricParameterType } from 'src/lib/schemas'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    tooltipped: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.grey[500],
    },
  }),
)

/**
 * Displays a metric value interval.
 */
export default function MetricValueInterval({
  intervalName,
  metricParameterType,
  isDifference = false,
  bottomValue,
  topValue,
  displayTooltipHint = true,
  displayPositiveSign = true,
}: {
  intervalName: string
  metricParameterType: MetricParameterType
  isDifference?: boolean
  bottomValue: number
  topValue: number
  displayTooltipHint?: boolean
  displayPositiveSign?: boolean
}): JSX.Element {
  const classes = useStyles()
  const metricValueFormat = getMetricValueFormatData({ metricParameterType, isDifference })
  return (
    <Tooltip
      title={
        <>
          <strong>Interpretation:</strong>
          <br />
          There is a 95% probability that {intervalName} is between{' '}
          <MetricValue
            value={bottomValue}
            metricParameterType={metricParameterType}
            isDifference={isDifference}
            displayPositiveSign={displayPositiveSign}
          />{' '}
          and{' '}
          <MetricValue
            value={topValue}
            metricParameterType={metricParameterType}
            isDifference={isDifference}
            displayPositiveSign={displayPositiveSign}
          />
          .
        </>
      }
    >
      <span className={clsx(displayTooltipHint && classes.tooltipped)}>
        <MetricValue
          value={bottomValue}
          metricParameterType={metricParameterType}
          isDifference={isDifference}
          displayUnit={false}
          displayPositiveSign={displayPositiveSign}
        />
        &nbsp;to&nbsp;
        <MetricValue
          value={topValue}
          metricParameterType={metricParameterType}
          isDifference={isDifference}
          displayUnit={false}
          displayPositiveSign={displayPositiveSign}
        />
        &nbsp;{metricValueFormat.unit}
      </span>
    </Tooltip>
  )
}
