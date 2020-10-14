// istanbul ignore file; Even though it sits with components this is a "page" component
import {
  Button,
  createStyles,
  LinearProgress,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'

import AnalysesApi from 'src/api/AnalysesApi'
import ExperimentsApi from 'src/api/ExperimentsApi'
import MetricsApi from 'src/api/MetricsApi'
import SegmentsApi from 'src/api/SegmentsApi'
import ExperimentCodeSetup from 'src/components/ExperimentCodeSetup'
import ExperimentDetails from 'src/components/ExperimentDetails'
import ExperimentDisableButton from 'src/components/ExperimentDisableButton'
import Layout from 'src/components/Layout'
import { Analysis, ExperimentFull, Status } from 'src/lib/schemas'
import { useDataLoadingError, useDataSource } from 'src/utils/data-loading'
import { createUnresolvingPromise, or } from 'src/utils/general'

import ExperimentDebug from './experiment-results/ExperimentDebug'
import ExperimentRunButton from './ExperimentRunButton'

const NoSsrExperimentResults = dynamic(() => import('src/components/experiment-results/ExperimentResults'), {
  ssr: false,
})

const NextMuiLink = React.forwardRef(
  // istanbul ignore next; Just the trivial className = undefined path that is missing
  // Should be refactored soon anyway
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
    title: {
      margin: theme.spacing(3, 0, 1, 0),
      color: theme.palette.grey.A700,
    },
    titleName: {
      fontFamily: theme.custom.fonts.monospace,
      color: '#000',
    },
    titleNameSkeleton: {
      display: 'inline-block',
    },
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
    topBarActions: {
      display: 'flex',
      alignItems: 'flex-end',
      '& > *': {
        marginLeft: 4,
        marginBottom: 7,
      },
    },
  }),
)

export enum ExperimentView {
  Overview = 'overview',
  Results = 'results',
  Debug = 'debug',
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
}): JSX.Element {
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

  const canEditInWizard = experiment && experiment.status === Status.Staging

  return (
    <Layout headTitle={`${experiment?.name ?? 'unknown'} - Experiment`}>
      <>
        <div className={classes.title}>
          <Typography variant='h2'>
            Experiment:{' '}
            {experiment ? (
              <span className={classes.titleName}>{experiment.name}</span>
            ) : (
              <Skeleton className={classes.titleNameSkeleton} variant='text' width={200} />
            )}
          </Typography>
        </div>
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
            {debugMode && (
              <Tab
                className={classes.topBarTab}
                label='Debug'
                value={ExperimentView.Debug}
                component={NextMuiLink}
                href='/experiments/[id]/debug'
                hrefAs={`/experiments/${experimentId}/debug`}
              />
            )}
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
            <Tooltip title={canEditInWizard ? '' : 'Only available for staging experiments.'}>
              <span>
                <Button
                  variant='outlined'
                  color='primary'
                  component={NextMuiLink}
                  href={`/experiments/[id]/wizard-edit`}
                  hrefAs={`/experiments/${experimentId}/wizard-edit`}
                  disabled={!canEditInWizard}
                >
                  Edit In Wizard
                </Button>
              </span>
            </Tooltip>{' '}
            <ExperimentRunButton {...{ experiment, experimentReloadRef }} />{' '}
            <ExperimentDisableButton {...{ experiment, experimentReloadRef }} />
          </div>
        </div>
        {isLoading && <LinearProgress />}
        {experiment && metrics && segments && analyses && (
          <>
            {view === ExperimentView.Overview && (
              <ExperimentDetails {...{ experiment, metrics, segments, experimentReloadRef }} />
            )}
            {view === ExperimentView.Results && (
              <NoSsrExperimentResults {...{ experiment, metrics, analyses, debugMode }} />
            )}
            {view === ExperimentView.Debug && debugMode && (
              <ExperimentDebug {...{ experiment, metrics, analyses, debugMode }} />
            )}
            {view === ExperimentView.CodeSetup && <ExperimentCodeSetup />}
          </>
        )}
      </>
    </Layout>
  )
}
