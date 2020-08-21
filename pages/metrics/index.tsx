import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  makeStyles,
  Theme,
} from '@material-ui/core'
import debugFactory from 'debug'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
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

  const { enqueueSnackbar } = useSnackbar()

  // Edit Metric Modal
  const [editMetricMetricId, setEditMetricMetricId] = useState<number | null>(null)
  const isEditingMetric = editMetricMetricId !== null
  const {
    isLoading: editMetricIsLoading,
    data: editMetricInitialMetric,
    error: editMetricError,
  } = useDataSource(async () => {
    return editMetricMetricId === null ? null : await MetricsApi.findById(editMetricMetricId)
  }, [editMetricMetricId])
  useDataLoadingError(editMetricError, 'Metric to edit')
  const onEditMetric = (metricId: number) => {
    setEditMetricMetricId(metricId)
  }
  const onCancelEditMetric = () => {
    setEditMetricMetricId(null)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  const onSubmitEditMetric = async (formData: unknown) => {
    // TODO: Full submission
    enqueueSnackbar('Metric Edited!', { variant: 'success' })
    setEditMetricMetricId(null)
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
  const onCancelAddMetric = () => {
    setIsAddingMetric(false)
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
  const onSubmitAddMetric = async (formData: unknown) => {
    // TODO: Full submission
    enqueueSnackbar('Metric Added!', { variant: 'success' })
    setIsAddingMetric(false)
  }

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
      <Dialog open={isEditingMetric} aria-labelledby='edit-metric-form-dialog-title'>
        <DialogTitle id='edit-metric-form-dialog-title'>Edit Metric</DialogTitle>
        {editMetricIsLoading && <LinearProgress />}
        {editMetricInitialMetric && (
          <Formik initialValues={{ metric: editMetricInitialMetric }} onSubmit={onSubmitEditMetric}>
            {(formikProps) => (
              <form onSubmit={formikProps.handleSubmit}>
                <DialogContent></DialogContent>
                <DialogActions>
                  <Button onClick={onCancelEditMetric} color='primary'>
                    Cancel
                  </Button>
                  <Button color='primary' type='submit'>
                    Save
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        )}
      </Dialog>
      <Dialog open={isAddingMetric} aria-labelledby='add-metric-form-dialog-title'>
        <DialogTitle id='add-metric-form-dialog-title'>Add Metric</DialogTitle>
        <Formik initialValues={{ metric: addMetricInitialMetric }} onSubmit={onSubmitAddMetric}>
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit}>
              <DialogContent></DialogContent>
              <DialogActions>
                <Button onClick={onCancelAddMetric} color='primary'>
                  Cancel
                </Button>
                <Button color='primary' type='submit'>
                  Add
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Layout>
  )
}

export default MetricsIndexPage
