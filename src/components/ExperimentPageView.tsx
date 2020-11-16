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
import React from 'react'
import { Link } from 'react-router-dom'

import AnalysesApi from 'src/api/AnalysesApi'
import ExperimentsApi from 'src/api/ExperimentsApi'
import MetricsApi from 'src/api/MetricsApi'
import SegmentsApi from 'src/api/SegmentsApi'
import TagsApi from 'src/api/TagsApi'
import ExperimentCodeSetup from 'src/components/ExperimentCodeSetup'
import ExperimentDetails from 'src/components/ExperimentDetails'
import ExperimentDisableButton from 'src/components/ExperimentDisableButton'
import Layout from 'src/components/Layout'
import { Analysis, ExperimentFull, Status } from 'src/lib/schemas'
import { useDataLoadingError, useDataSource } from 'src/utils/data-loading'
import { createUnresolvingPromise, or } from 'src/utils/general'

import ExperimentDebug from './experiment-results/ExperimentDebug'
import ExperimentResults from './experiment-results/ExperimentResults'
import ExperimentRunButton from './ExperimentRunButton'

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

  const { isLoading: tagsIsLoading, data: tags, error: tagsError } = useDataSource(() => TagsApi.findAll(), [])
  useDataLoadingError(tagsError, 'Tags')

  const { isLoading: analysesIsLoading, data: analyses, error: analysesError } = useDataSource(
    () => (experimentId ? AnalysesApi.findByExperimentId(experimentId) : createUnresolvingPromise<Analysis[]>()),
    [experimentId],
  )
  useDataLoadingError(analysesError, 'Analyses')

  const isLoading = or(experimentIsLoading, metricsIsLoading, segmentsIsLoading, tagsIsLoading, analysesIsLoading)

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
              component={Link}
              to={`/experiments/${experimentId}/overview`}
            />
            <Tab
              className={classes.topBarTab}
              label='Results'
              value={ExperimentView.Results}
              component={Link}
              to={`/experiments/${experimentId}/results`}
            />
            {debugMode && (
              <Tab
                className={classes.topBarTab}
                label='Debug'
                value={ExperimentView.Debug}
                component={Link}
                to={`/experiments/${experimentId}/debug`}
              />
            )}
            <Tab
              className={classes.topBarTab}
              label='Code Setup'
              value={ExperimentView.CodeSetup}
              component={Link}
              to={`/experiments/${experimentId}/code-setup`}
            />
          </Tabs>
          <div className={classes.topBarActions}>
            <Tooltip title={canEditInWizard ? '' : 'Only available for staging experiments.'}>
              <span>
                <Button
                  variant='outlined'
                  color='primary'
                  component={Link}
                  to={`/experiments/${experimentId}/wizard-edit`}
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
        {experiment && metrics && segments && analyses && tags && (
          <>
            {view === ExperimentView.Overview && (
              <ExperimentDetails {...{ experiment, metrics, segments, tags, experimentReloadRef }} />
            )}
            {view === ExperimentView.Results && <ExperimentResults {...{ experiment, metrics, analyses, debugMode }} />}
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
