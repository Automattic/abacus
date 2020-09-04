// istanbul ignore file; Even though it sits with components this is a "page" component
import { Button, createStyles, LinearProgress, makeStyles, Tab, Tabs, Theme } from '@material-ui/core'
import _ from 'lodash'
import Link from 'next/link'
import React from 'react'

import AnalysesApi from '@/api/AnalysesApi'
import ExperimentsApi from '@/api/ExperimentsApi'
import MetricsApi from '@/api/MetricsApi'
import SegmentsApi from '@/api/SegmentsApi'
import ExperimentResults from '@/components/experiment-results/ExperimentResults'
import ExperimentCodeSetup from '@/components/ExperimentCodeSetup'
import ExperimentDetails from '@/components/ExperimentDetails'
import ExperimentDisableButton from '@/components/ExperimentDisableButton'
import Layout from '@/components/Layout'
import { Analysis, ExperimentFull } from '@/lib/schemas'
import { useDataLoadingError, useDataSource } from '@/utils/data-loading'
import { createUnresolvingPromise, or } from '@/utils/general'

const NextMuiLink = React.forwardRef(
  (
    {
      className = undefined,
      href,
      hrefAs,
      children,
      prefetch = false,
    }: { className?: string; href: string; hrefAs: string; children?: React.ReactNode; prefetch?: boolean },
    ref,
  ) => (
    <Link {...{ href, as: hrefAs, prefetch, ref }}>
      <a className={className}>{children}</a>
    </Link>
  ),
)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    topBar: {
      display: 'flex',
      marginBottom: theme.spacing(2),
    },
    topBarTabs: {
      flex: 1,
    },
    topBarTab: {
      minWidth: 110,
    },
    topBarActions: {},
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
            <Tab
              className={classes.topBarTab}
              label='Overview'
              value={ExperimentView.Overview}
              component={NextMuiLink}
              href='/experiments/[id]'
              hrefAs={`/experiments/${experimentId}`}
            />
            <Tab
              className={classes.topBarTab}
              label='Results'
              value={ExperimentView.Results}
              component={NextMuiLink}
              href='/experiments/[id]/results'
              hrefAs={`/experiments/${experimentId}/results`}
            />
            <Tab
              className={classes.topBarTab}
              label='Code Setup'
              value={ExperimentView.CodeSetup}
              component={NextMuiLink}
              href='/experiments/[id]/code-setup'
              hrefAs={`/experiments/${experimentId}/code-setup`}
            />
          </Tabs>
          <div className={classes.topBarActions}>
            <Button
              variant='outlined'
              color='primary'
              component={NextMuiLink}
              href={`/experiments/[id]/wizard-edit`}
              hrefAs={`/experiments/${experimentId}/wizard-edit`}
            >
              Edit In Wizard
            </Button>{' '}
            <Button variant='outlined' color='secondary'>
              Run
            </Button>{' '}
            <ExperimentDisableButton {...{ experiment, experimentReloadRef }} />
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
