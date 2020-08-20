import { Button, createStyles, LinearProgress, makeStyles, Theme } from '@material-ui/core'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import MetricsTable from '@/components/MetricsTable'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { MetricParameterType } from '@/lib/schemas'

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
  const isEditingMetric = editMetricMetricId !== null
  const { isLoading: editMetricIsLoading, data: editMetricInitialMetric, error: editMetricError } = useDataSource(async () => {
    return editMetricMetricId !== null ? await MetricsApi.findById(editMetricMetricId) : null
  }, [editMetricMetricId])
  useDataLoadingError(error, 'Metric to edit')
  const onEditMetric = (metricId: number) => {
    setEditMetricMetricId(metricId)
  }

  // Add Metric Modal
  const [isAddingMetric, setIsAddingMetric] = useState<boolean>(false)
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
            <MetricsTable canEditMetrics={debugMode} metrics={metrics || []} onEditMetric={onEditMetric} />
            <div className={classes.actions}>
              <Button variant='contained' color='secondary' onClick={onAddMetric}>
                Add Metric
            </Button>
            </div>
          </>
        )}

    </Layout>
  )
}

export default MetricsIndexPage
