import { createStyles, Link, makeStyles, Paper, Theme, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'

import { HealthIndication, HealthIndicator, HealthIndicatorUnit } from 'src/lib/analyses'

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'capitalize',
    },
  }),
)

const indicationToMessage: Record<HealthIndication, React.ReactNode> = {
  [HealthIndication.Nominal]: (
    <span role='img' aria-label='Nominal'>
      🆗
    </span>
  ),
  [HealthIndication.PossibleIssue]: (
    <span role='img' aria-label='PossibleIssue'>
      ✴️
    </span>
  ),
  [HealthIndication.ProbableIssue]: (
    <span role='img' aria-label='CertainIssue'>
      🆘
    </span>
  ),
}

// function formatIndicatorValue

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
            {indicationToMessage[indicator.indication]} <Link href={indicator.link}>{indicator.name}</Link>
          </div>
        </Tooltip>
      ))}
    </Paper>
  )
}
