import { Button, createStyles, LinearProgress, makeStyles, Theme } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import React from 'react'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import MetricsTable from '@/components/MetricsTable'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'

const debug = debugFactory('abacus:pages/metrics/index.tsx')

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    actions: {
      marginTop: theme.spacing(2),
      display: 'flex',
      justifyContent: 'flex-end',
    },
  }),
)

const MetricsIndexPage = () => {
  debug('MetricsIndexPage#render')
  const classes = useStyles()

  const { isLoading, data: metrics, error } = useDataSource(() => MetricsApi.findAll(), [])
  useDataLoadingError(error, 'Metrics')

  const router = useRouter()
  const debugMode = router.query.debug === 'true'

  const onEditMetric = (metricId: number) => alert(metricId)
  const onAddMetric = () => alert('add metric')

  return (
    <Layout title='Metrics'>
      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          <MetricsTable metrics={metrics || []} onEditMetric={debugMode ? onEditMetric : undefined} />
          {debugMode && (
            <div className={classes.actions}>
              <Button variant='contained' color='secondary' onClick={onAddMetric}>
                Add Metric
              </Button>
            </div>
          )}
        </>
      )}
    </Layout>
  )
}

export default MetricsIndexPage
