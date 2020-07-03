import { LinearProgress } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React, { useEffect, useState } from 'react'

import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentDetails from '@/components/ExperimentDetails'
import ExperimentTabs from '@/components/ExperimentTabs'
import ExperimentToolbar, { ExperimentToolbarMode } from '@/components/ExperimentToolbar'
import Layout from '@/components/Layout'
import { ExperimentFull, MetricBare, Segment } from '@/models'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabs: {
      flex: '1 0 auto',
      marginBottom: theme.spacing(2),
    },
    tabsAndToolbar: {
      alignItems: 'center',
      display: 'flex',
    },
    toolbarRoot: {
      justifyContent: 'flex-end',
      minHeight: 48, // Same height used by MUITabs. Allows them to align well.
    },
    // Note: The `xs` breakpoint is too late to switch to column flex layout. The
    // `sm` breakpoint is way too soon to switch. So, picked a value somewhere in
    // between. The toolbar is widest when both the "Disable" and "Add Conclusions"
    // buttons are displayed.
    [theme.breakpoints.down(640)]: {
      tabs: {
        alignSelf: 'flex-start',
        flex: '1 0 auto',
      },
      tabsAndToolbar: {
        flexDirection: 'column',
      },
      toolbarRoot: {
        alignSelf: 'flex-end',
      },
    },
  }),
)

export default function ExperimentPage() {
  const classes = useStyles()
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [mode, setMode] = useState<ExperimentToolbarMode>('view')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const [experiment, setExperiment] = useState<ExperimentFull | null>(null)
  const [metrics, setMetrics] = useState<MetricBare[] | null>(null)
  const [segments, setSegments] = useState<Segment[] | null>(null)

  /* istanbul ignore next; to be handled by an e2e test */
  function handleCancel() {
    // TODO: If form is dirty, then prompt for cancellation.
    setMode('view')
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleConclude() {
    setMode('conclude')
    setTimeout(() => {
      window.alert('TODO: Handle conclude mode.')
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleDisable() {
    setMode('disable')
    setTimeout(() => {
      const disable = window.confirm('Are you sure you want to disable?')

      if (disable) {
        setTimeout(() => {
          window.alert('TODO: Handle disable mode.')
          setMode('view')
        }, 100)
      } else {
        setMode('view')
      }
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleEdit() {
    setMode('edit')
    setTimeout(() => {
      window.alert('TODO: Handle edit mode.')
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleSave() {
    if (mode === 'conclude') {
      window.alert('TODO: save conclusions')
    } else if (mode === 'edit') {
      window.alert('TODO: update details')
    }
    setMode('view')
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all([ExperimentsApi.findById(experimentId), MetricsApi.findAll(), SegmentsApi.findAll()])
      .then(([experiment, metrics, segments]) => {
        setExperiment(experiment)
        setMetrics(metrics)
        setSegments(segments)
        return
      })
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, [experimentId])

  return (
    <Layout title={`Experiment: ${experiment?.name || ''}`} error={error}>
      {isLoading ? (
        <LinearProgress />
      ) : (
        experiment &&
        metrics &&
        segments && (
          <>
            <div className={classes.tabsAndToolbar}>
              <ExperimentTabs className={classes.tabs} experiment={experiment} tab='details' />
              <ExperimentToolbar
                className={classes.toolbarRoot}
                experiment={experiment}
                mode={mode}
                onCancel={handleCancel}
                onConclude={handleConclude}
                onDisable={handleDisable}
                onEdit={handleEdit}
                onSave={handleSave}
              />
            </div>
            <ExperimentDetails experiment={experiment} metrics={metrics} segments={segments} />
          </>
        )
      )}
    </Layout>
  )
}
