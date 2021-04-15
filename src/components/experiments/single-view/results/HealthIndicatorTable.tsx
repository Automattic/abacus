import {
  createStyles,
  Link,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { green } from '@material-ui/core/colors'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'

import { HealthIndicationSeverity, HealthIndicator, HealthIndicatorUnit } from 'src/lib/analyses'

const indicationSeverityClassSymbol = (severity: HealthIndicationSeverity) => `indicationSeverity${severity}`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    monospace: {
      fontFamily: theme.custom.fonts.monospace,
    },
    indication: {
      padding: theme.spacing(2),
    },
    [indicationSeverityClassSymbol(HealthIndicationSeverity.Ok)]: {
      background: '#56ff564f',
    },
    [indicationSeverityClassSymbol(HealthIndicationSeverity.Warning)]: {
      background: '#fde799ab',
    },
    [indicationSeverityClassSymbol(HealthIndicationSeverity.Error)]: {
      background: '#ff868661',
    },
    tooltip: {
      borderBottomWidth: 1,
      borderBottomStyle: 'dashed',
      borderBottomColor: theme.palette.grey[500],
    },
    table: {},
  }),
)

const severityEmoji: Record<HealthIndicationSeverity, string> = {
  [HealthIndicationSeverity.Ok]: '',
  [HealthIndicationSeverity.Warning]: 'ℹ️',
  [HealthIndicationSeverity.Error]: '🆘',
}

export default function HealthIndicatorTable({
  className,
  indicators,
}: {
  className?: string
  indicators: HealthIndicator[]
}): JSX.Element {
  const classes = useStyles()
  return (
    <TableContainer className={className}>
      <Table className={classes.table} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Value</TableCell>
            <TableCell>Indication</TableCell>
            <TableCell>Indication Reason</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {indicators.map((indicator) => (
            <TableRow key={indicator.name}>
              <TableCell scope='row'>
                <Link href={indicator.link}>{indicator.name}</Link>
              </TableCell>
              <TableCell scope='row' className={classes.monospace}>
                {indicator.unit === HealthIndicatorUnit.Pvalue ? (
                  <Tooltip title='The smaller the p-value the more likely there is an issue.'>
                    <span className={classes.tooltip}>p-value</span>
                  </Tooltip>
                ) : (
                  <span>ratio</span>
                )}
              </TableCell>
              <TableCell scope='row' className={classes.monospace}>
                {indicator.value}
              </TableCell>
              <TableCell
                scope='row'
                className={clsx(
                  classes.indication,
                  classes[indicationSeverityClassSymbol(indicator.indication.severity)],
                  classes.monospace,
                )}
              >
                <span>
                  {indicator.indication.code} {severityEmoji[indicator.indication.severity]}
                </span>
              </TableCell>
              <TableCell scope='row' className={classes.monospace}>
                {indicator.indication.reason}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
