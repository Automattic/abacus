// istanbul ignore file; Even though it sits with components this is a "page" component
import { createStyles, LinearProgress, makeStyles, Theme, Tab, Tabs, Button } from '@material-ui/core'
import _ from 'lodash'
import React from 'react'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentResults from '@/components/experiment-results/ExperimentResults'
import ExperimentCodeSetup from '@/components/ExperimentCodeSetup'
import ExperimentDetails from '@/components/ExperimentDetails'
import Layout from '@/components/Layout'
import { Analysis, ExperimentFull, Status } from '@/lib/schemas'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { createUnresolvingPromise, or } from '@/utils/general'
import { useRouter } from 'next/router'

const useLinkTabStyles = makeStyles(() =>
  createStyles({
    tab: {
      minWidth: 110,
    },
  }),
)

function LinkTab({ as, label, url, value }: { as?: string; label: React.ReactNode; url: string; value: string }) {
  const classes = useLinkTabStyles()
  const router = useRouter()
  return (
    <Tab
      className={classes.tab}
      label={label}
      onClick={
        /* istanbul ignore next; to be handled by an e2e test */
        () => {
          router.push(url, as)
        }
      }
      value={value}
    />
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBar: {
      display: 'flex',
      marginBottom: theme.spacing(2),
    },
    topBarTabs: {
      flex: 1,
    },
    topBarActions: {},
    topBarActionsDisableOutlined: {
      borderColor: theme.palette.error.dark,
      color: theme.palette.error.dark,
    },
  }),
)

export enum ExperimentView {
  Overview = 'overview',
  Results = 'results',
  CodeSetup = 'code-setup',
}

export default function ExperimentPageView({
  view,
  experimentId,
  debugMode,
}: {
  view: ExperimentView
  experimentId: number
  debugMode: boolean
}) {
  const classes = useStyles()

  const {
    isLoading: experimentIsLoading,
    data: experiment,
    error: experimentError,
    reloadRef: experimentReloadRef,
  } = useDataSource(
    () => (experimentId ? ExperimentsApi.findById(experimentId) : createUnresolvingPromise<ExperimentFull>()),
    [experimentId],
  )
  useDataLoadingError(experimentError, 'Experiment')

  const { isLoading: metricsIsLoading, data: metrics, error: metricsError } = useDataSource(
    () => MetricsApi.findAll(),
    [],
  )
  useDataLoadingError(metricsError, 'Metrics')

  const { isLoading: segmentsIsLoading, data: segments, error: segmentsError } = useDataSource(
    () => SegmentsApi.findAll(),
    [],
  )
  useDataLoadingError(segmentsError, 'Segments')

  const { isLoading: analysesIsLoading, data: analyses, error: analysesError } = useDataSource(
    () => (experimentId ? AnalysesApi.findByExperimentId(experimentId) : createUnresolvingPromise<Analysis[]>()),
    [experimentId],
  )
  useDataLoadingError(analysesError, 'Analyses')

  const isLoading = or(experimentIsLoading, metricsIsLoading, segmentsIsLoading, analysesIsLoading)

  return (
    <Layout title={`Experiment: ${experiment?.name || ''}`}>
      <>
        <div className={classes.topBar}>
          <Tabs className={classes.topBarTabs} value={view}>
            <LinkTab
              label='Overview'
              value={ExperimentView.Overview}
              url='/experiments/[id]'
              as={`/experiments/${experimentId}`}
            />
            <LinkTab
              label='Results'
              value={ExperimentView.Results}
              url='/experiments/[id]/results'
              as={`/experiments/${experimentId}/results`}
            />
            <LinkTab
              label='Code Setup'
              value={ExperimentView.CodeSetup}
              url='/experiments/[id]/code-setup'
              as={`/experiments/${experimentId}/code-setup`}
            />
          </Tabs>
          <div className={classes.topBarActions}>
            <Button variant="outlined" color="secondary"> Edit In Wizard </Button>
            {' '}
            <Button variant="outlined" classes={{ outlined: classes.topBarActionsDisableOutlined }}> Disable </Button>
          </div>
        </div>
        {isLoading && <LinearProgress />}
        {experiment && metrics && segments && analyses && (
          <>
            {view === ExperimentView.Overview && (
              <ExperimentDetails {...{ experiment, metrics, segments, experimentReloadRef }} />
            )}
            {view === ExperimentView.Results && <ExperimentResults {...{ experiment, metrics, analyses, debugMode }} />}
            {view === ExperimentView.CodeSetup && <ExperimentCodeSetup />}
          </>
        )}
      </>
    </Layout>
  )
}
