import { Button, createStyles, LinearProgress, makeStyles, Theme } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import MetricsTable from '@/components/MetricsTable'
import { MetricParameterType } from '@/lib/schemas'
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

  // Edit Metric Modal
  const [editMetricMetricId, setEditMetricMetricId] = useState<number | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isEditingMetric = editMetricMetricId !== null
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLoading: editMetricIsLoading,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: editMetricInitialMetric,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    error: editMetricError,
  } = useDataSource(async () => {
    return editMetricMetricId === null ? null : await MetricsApi.findById(editMetricMetricId)
  }, [editMetricMetricId])
  useDataLoadingError(editMetricError, 'Metric to edit')
  const onEditMetric = (metricId: number) => {
    setEditMetricMetricId(metricId)
  }

  // Add Metric Modal
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAddingMetric, setIsAddingMetric] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addMetricInitialMetric = {
    name: '',
    description: '',
    parameterType: MetricParameterType.Conversion,
    higherIsBetter: 'true',
    params: '',
  }
  const onAddMetric = () => setIsAddingMetric(true)

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
