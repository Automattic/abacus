import { createStyles, LinearProgress, makeStyles, Snackbar, Theme, Typography } from '@material-ui/core'
import debugFactory from 'debug'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'

import MetricsApi from '@/api/MetricsApi'
import { MetricBare, MetricFull } from '@/models'
import { defaultTableOptions } from '@/utils/material-table'

const debug = debugFactory('abacus:components/MetricsTable.tsx')

const tableColumns = [
  { title: 'Name', field: 'name' },
  { title: 'Description', field: 'description' },
  { title: 'Parameter Type', field: 'parameterType' },
]

const useMetricDetailStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'grid',
      gridTemplateColumns: '10rem auto',
      gridRowGap: theme.spacing(1),
      padding: theme.spacing(1, 4),
      '& dt': {
        fontWeight: 600,
      },
      '& dd': {
        fontFamily: 'monospace',
        whiteSpace: 'pre',
      },
    },
  }),
)

/* istanbul ignore next; TODO: Test once concrete */
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
      {isLoading && <LinearProgress />}
      <Snackbar open={!!error} message='Oops! Something went wrong while trying to load a Metric.' />
      {!isLoading && !error && metricFull && (
        <dl className={classes.root}>
          <Typography component='dt'>Direction:</Typography>
          <Typography component='dd'>{metricFull.higherIsBetter ? 'Higher is better.' : 'Lower is better.'}</Typography>
          <Typography component='dt'>Parameters:</Typography>
          <Typography component='dd'>{paramsStringified}</Typography>
        </dl>
      )}
    </>
  )
}

/**
 * Renders a table of "bare" metric information.
 */
const MetricsTable = ({ metrics }: { metrics: MetricBare[] }) => {
  debug('MetricsTable#render')

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
