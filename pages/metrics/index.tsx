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
import { Formik, FormikProps } from 'formik'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import React, { useState } from 'react'
import * as yup from 'yup'

import MetricsApi from '@/api/MetricsApi'
import Layout from '@/components/Layout'
import LoadingButtonContainer from '@/components/LoadingButtonContainer'
import MetricFormFields from '@/components/MetricFormFields'
import MetricsTable from '@/components/MetricsTable'
import { MetricFormData, metricToFormData } from '@/lib/form-data'
import { MetricFullNew, metricFullNewSchema } from '@/lib/schemas'
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

  const { isLoading, data: metrics, error, reloadRef } = useDataSource(() => MetricsApi.findAll(), [])
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
  const onSubmitEditMetric = async ({ metric }: { metric: MetricFormData }) => {
    try {
      if (!editMetricMetricId) {
        throw new Error(`Missing metricId, this shouldn't happen.`)
      }
      await MetricsApi.put(editMetricMetricId, (metric as unknown) as MetricFullNew)
      enqueueSnackbar('Metric Edited!', { variant: 'success' })
      reloadRef.current()
      setEditMetricMetricId(null)
    } catch (e) /* istanbul ignore next; Shouldn't happen */ {
      console.error(e)
      enqueueSnackbar('Oops! Something went wrong while trying to update your metric.', { variant: 'error' })
    }
  }

  // Add Metric Modal
  const [isAddingMetric, setIsAddingMetric] = useState<boolean>(false)
  const onAddMetric = () => setIsAddingMetric(true)
  const onCancelAddMetric = () => {
    setIsAddingMetric(false)
  }
  const onSubmitAddMetric = async ({ metric }: { metric: MetricFormData }) => {
    try {
      await MetricsApi.create((metric as unknown) as MetricFullNew)
      enqueueSnackbar('Metric Added!', { variant: 'success' })
      reloadRef.current()
      setIsAddingMetric(false)
    } catch (e) /* istanbul ignore next; Shouldn't happen */ {
      console.error(e)
      enqueueSnackbar('Oops! Something went wrong while trying to add your metric.', { variant: 'error' })
    }
  }

  return (
    <Layout title='Metrics'>
      {isLoading && <LinearProgress />}
      {metrics && (
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
      <Dialog open={isEditingMetric} fullWidth aria-labelledby='edit-metric-form-dialog-title'>
        <DialogTitle id='edit-metric-form-dialog-title'>Edit Metric</DialogTitle>
        {editMetricIsLoading && <LinearProgress />}
        {editMetricInitialMetric && (
          <Formik
            initialValues={{ metric: metricToFormData(editMetricInitialMetric) }}
            onSubmit={onSubmitEditMetric}
            validationSchema={yup.object({ metric: metricFullNewSchema })}
          >
            {(formikProps) => (
              <form onSubmit={formikProps.handleSubmit} noValidate>
                <DialogContent>
                  <MetricFormFields formikProps={formikProps as FormikProps<{ metric: MetricFormData }>} />
                </DialogContent>
                <DialogActions>
                  <Button onClick={onCancelEditMetric} color='primary'>
                    Cancel
                  </Button>
                  <LoadingButtonContainer isLoading={formikProps.isSubmitting}>
                    <Button
                      type='submit'
                      variant='contained'
                      color='secondary'
                      disabled={formikProps.isSubmitting || !formikProps.isValid}
                    >
                      Save
                    </Button>
                  </LoadingButtonContainer>
                </DialogActions>
              </form>
            )}
          </Formik>
        )}
      </Dialog>
      <Dialog open={isAddingMetric} fullWidth aria-labelledby='add-metric-form-dialog-title'>
        <DialogTitle id='add-metric-form-dialog-title'>Add Metric</DialogTitle>
        <Formik
          initialValues={{ metric: metricToFormData({}) }}
          onSubmit={onSubmitAddMetric}
          validationSchema={yup.object({ metric: metricFullNewSchema })}
        >
          {(formikProps) => (
            <form onSubmit={formikProps.handleSubmit} noValidate>
              <DialogContent>
                <MetricFormFields formikProps={formikProps as FormikProps<{ metric: MetricFormData }>} />
              </DialogContent>
              <DialogActions>
                <Button onClick={onCancelAddMetric} color='primary'>
                  Cancel
                </Button>
                <LoadingButtonContainer isLoading={formikProps.isSubmitting}>
                  <Button
                    type='submit'
                    variant='contained'
                    color='secondary'
                    disabled={formikProps.isSubmitting || !formikProps.isValid}
                  >
                    Add
                  </Button>
                </LoadingButtonContainer>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
    </Layout>
  )
}

export default MetricsIndexPage
