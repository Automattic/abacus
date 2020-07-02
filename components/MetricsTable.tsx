import {
  createStyles,
  LinearProgress,
  makeStyles,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Theme,
  useTheme,
} from '@material-ui/core'
import debugFactory from 'debug'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'

import MetricsApi from '@/api/MetricsApi'
import { MetricBare, MetricFull } from '@/models'
import { formatBoolean } from '@/utils/formatters'
import { defaultTableOptions } from '@/utils/material-table'

const debug = debugFactory('abacus:components/MetricsTable.tsx')

/* istanbul ignore next */
const useMetricDetailStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2, 8),
      background: theme.palette.action.hover,
    },
    headerCell: {
      fontWeight: 'bold',
      width: '9rem',
      verticalAlign: 'top',
    },
    dataCell: {
      fontFamily: theme.custom.fonts.monospace,
    },
    pre: {
      whiteSpace: 'pre',
      maxHeight: '15rem',
      overflow: 'scroll',
      padding: theme.spacing(1),
      borderWidth: 1,
      borderColor: theme.palette.divider,
      borderStyle: 'solid',
      background: '#fff',
    },
  }),
)

/* istanbul ignore next; e2e is covering this for now */
const MetricDetail = ({ metricBare }: { metricBare: MetricBare }) => {
  const classes = useMetricDetailStyles()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [metricFull, setMetricFull] = useState<MetricFull | null>(null)
  useEffect(() => {
    setIsLoading(true)
    MetricsApi.findById(metricBare.metricId)
      .then(setMetricFull)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [metricBare.metricId])

  const params = metricFull?.eventParams || metricFull?.revenueParams
  const paramsStringified = params && JSON.stringify(params, null, 4)

  return (
    <>
      <Snackbar open={!!error} message='Oops! Something went wrong while trying to load a Metric.' />
      {isLoading && <LinearProgress />}
      {!isLoading && !error && metricFull && (
        <TableContainer className={classes.root}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className={classes.headerCell}>Higher is Better:</TableCell>
                <TableCell className={classes.dataCell}>{formatBoolean(metricFull.higherIsBetter)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.headerCell}>Parameters:</TableCell>
                <TableCell className={classes.dataCell}>
                  <div className={classes.pre}>{paramsStringified}</div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
}

/**
 * Renders a table of "bare" metric information.
 */
const MetricsTable = ({ metrics }: { metrics: MetricBare[] }) => {
  debug('MetricsTable#render')

  const theme = useTheme()
  const tableColumns = [
    {
      title: 'Name',
      field: 'name',
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
        fontWeight: theme.custom.fontWeights.monospaceBold,
      },
    },
    {
      title: 'Description',
      field: 'description',
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
      },
    },
    {
      title: 'Parameter Type',
      field: 'parameterType',
      cellStyle: {
        fontFamily: theme.custom.fonts.monospace,
      },
    },
  ]

  /* istanbul ignore next; e2e tests the metric details */
  return (
    <MaterialTable
      columns={tableColumns}
      data={metrics}
      onRowClick={(_event, _rowData, togglePanel) => togglePanel && togglePanel()}
      options={defaultTableOptions}
      detailPanel={(rowData) => <MetricDetail metricBare={rowData} />}
    />
  )
}

export default MetricsTable
