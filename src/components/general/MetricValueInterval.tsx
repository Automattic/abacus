import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import React from 'react'

import MetricValue, { metricValueFormatData } from 'src/components/general/MetricValue'
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
  bottomValue,
  topValue,
  displayTooltipHint = true,
}: {
  intervalName: string
  metricParameterType: MetricParameterType
  bottomValue: number
  topValue: number
  displayTooltipHint?: boolean
}): JSX.Element {
  const classes = useStyles()
  return (
    <Tooltip
      title={
        <>
          <strong>Interpretation:</strong>
          <br />
          There is a 95% probability that {intervalName} is between{' '}
          <MetricValue value={bottomValue} metricParameterType={metricParameterType} isDifference={true} /> and{' '}
          <MetricValue value={topValue} metricParameterType={metricParameterType} isDifference={true} />.
        </>
      }
    >
      <span className={clsx(displayTooltipHint && classes.tooltipped)}>
        <MetricValue
          value={bottomValue}
          metricParameterType={metricParameterType}
          isDifference={true}
          displayUnit={false}
          displayPositiveSign
        />
        &nbsp;to&nbsp;
        <MetricValue
          value={topValue}
          metricParameterType={metricParameterType}
          isDifference={true}
          displayUnit={false}
          displayPositiveSign
        />
        &nbsp;{metricValueFormatData[metricParameterType].unit}
      </span>
    </Tooltip>
  )
}
