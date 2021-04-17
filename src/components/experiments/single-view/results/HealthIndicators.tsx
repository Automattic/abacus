import { createStyles, Link, makeStyles, Paper, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'

import { HealthIndicationCode, HealthIndicator, HealthIndicatorUnit } from 'src/lib/analyses'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'capitalize',
    },
  }),
)

const indicationCodeToMessage: Record<HealthIndicationCode, React.ReactNode> = {
  [HealthIndicationCode.Nominal]: (
    <span role='img' aria-label='Nominal'>
      🆗
    </span>
  ),
  [HealthIndicationCode.ValueError]: (
    <span role='img' aria-label='ValueError'>
      🆘
    </span>
  ),
  [HealthIndicationCode.PossibleIssue]: (
    <span role='img' aria-label='PossibleIssue'>
      ✴️
    </span>
  ),
  [HealthIndicationCode.ProbableIssue]: (
    <span role='img' aria-label='CertainIssue'>
      🆘
    </span>
  ),
  [HealthIndicationCode.VeryLow]: (
    <span role='img' aria-label='Nominal'>
      🆘
    </span>
  ),
  [HealthIndicationCode.Low]: (
    <span role='img' aria-label='PossibleIssue'>
      ✴️
    </span>
  ),
  [HealthIndicationCode.High]: (
    <span role='img' aria-label='CertainIssue'>
      ✴️
    </span>
  ),
  [HealthIndicationCode.VeryHigh]: (
    <span role='img' aria-label='CertainIssue'>
      🆘
    </span>
  ),
}

export default function HealthIndicators({
  className,
  indicators,
}: {
  className?: string
  indicators: HealthIndicator[]
}): JSX.Element {
  const classes = useStyles()
  return (
    <Paper className={clsx(className, classes.root)}>
      {indicators.map((indicator) => (
        <Tooltip
          title={
            indicator.unit === HealthIndicatorUnit.Pvalue
              ? `There is a ${(indicator.value * 100).toPrecision(5)}% 
              probability that this result occurred by random chance.`
              : `${indicator.unit}: ${indicator.value.toFixed(6)}`
          }
          key={indicator.name}
        >
          <div>
            {indicationCodeToMessage[indicator.indication.code]} <Link href={indicator.link}>{indicator.name}</Link>
          </div>
        </Tooltip>
      ))}
    </Paper>
  )
}
