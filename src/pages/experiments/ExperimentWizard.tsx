import { createStyles, LinearProgress, makeStyles, Theme, Typography } from '@material-ui/core'
import debugFactory from 'debug'
import _ from 'lodash'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useHistory, useParams } from 'react-router-dom'

import { getEventNameCompletions, getUserCompletions } from 'src/api/AutocompleteApi'
import ExperimentsApi from 'src/api/ExperimentsApi'
import MetricsApi from 'src/api/MetricsApi'
import SegmentsApi from 'src/api/SegmentsApi'
import TagsApi from 'src/api/TagsApi'
import ExperimentForm from 'src/components/experiments/wizard/ExperimentForm'
import Layout from 'src/components/page-parts/Layout'
import { experimentToFormData } from 'src/lib/form-data'
import * as Normalizers from 'src/lib/normalizers'
import { ExperimentFull, ExperimentFullNew, TagNamespace } from 'src/lib/schemas'
import { useDataLoadingError, useDataSource } from 'src/utils/data-loading'
import { or, parseIdSlug } from 'src/utils/general'

const debug = debugFactory('abacus:pages/experiments/[id]/wizard-edit.tsx')

export enum ExperimentWizardMode {
  Create = 'create',
  Edit = 'edit',
  Clone = 'clone',
}

/**
 * Takes an experiment to clone and returns the initial data for the clone.
 *
 * @param experiment The experiment to clone
 */
function clonedExperiment(experiment: ExperimentFull): ExperimentFull {
  return {
    ...experiment,
    name: ``,
  }
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      margin: theme.spacing(3, 0, 0, 0),
      color: theme.palette.grey.A700,
    },
    progress: {
      marginTop: theme.spacing(2),
    },
  }),
)

export default function WizardEdit({
  experimentWizardMode,
}: {
  experimentWizardMode: ExperimentWizardMode
}): JSX.Element {
  const classes = useStyles()
  const history = useHistory()
  const { experimentIdSlug } = useParams<{ experimentIdSlug?: string }>()
  const experimentId = experimentIdSlug !== undefined && parseIdSlug(experimentIdSlug)
  debug(`ExperimentWizard#render expermentIdSlug: ${experimentIdSlug ?? ''}, mode: ${experimentWizardMode}`)

  const { isLoading: experimentIsLoading, data: experiment, error: experimentError } = useDataSource(
    async () => (experimentId ? await ExperimentsApi.findById(experimentId) : ({} as ExperimentFull)),
    [experimentId],
  )
  useDataLoadingError(experimentError, 'Experiment')

  const { isLoading: metricsIsLoading, data: indexedMetrics, error: metricsError } = useDataSource(
    async () => Normalizers.indexMetrics(await MetricsApi.findAll()),
    [],
  )
  useDataLoadingError(metricsError, 'Metrics')

  const { isLoading: segmentsIsLoading, data: indexedSegments, error: segmentsError } = useDataSource(
    async () => Normalizers.indexSegments(await SegmentsApi.findAll()),
    [],
  )
  useDataLoadingError(segmentsError, 'Segments')

  const exclusionGroupCompletionDataSource = useDataSource(async () => {
    const tags = await TagsApi.findAll()
    const exclusionGroupTags = tags.filter((tag) => tag.namespace === TagNamespace.ExclusionGroup)
    return exclusionGroupTags.map((tag) => ({
      name: tag.name,
      value: tag.tagId,
    }))
  }, [])
  const userCompletionDataSource = useDataSource(getUserCompletions, [])
  const eventCompletionDataSource = useDataSource(getEventNameCompletions, [])

  const completionBag = {
    userCompletionDataSource,
    eventCompletionDataSource,
    exclusionGroupCompletionDataSource,
  }

  const isLoading = or(
    experimentIsLoading,
    metricsIsLoading,
    segmentsIsLoading,
    ...Object.values(completionBag).map((dataSource) => dataSource.isLoading),
  )

  const { enqueueSnackbar } = useSnackbar()
  const onSubmitByExperimentWizardMode: Record<ExperimentWizardMode, (formData: unknown) => Promise<void>> = {
    [ExperimentWizardMode.Create]: async (formData: unknown) => {
      try {
        const { experiment } = formData as { experiment: ExperimentFullNew }
        const receivedExperiment = await ExperimentsApi.create(experiment)
        enqueueSnackbar('Experiment Created!', { variant: 'success' })
        history.push(`/experiments/${receivedExperiment.experimentId}/code-setup`)
      } catch (error) {
        enqueueSnackbar('Failed to create experiment 😨 (Form data logged to console.)', { variant: 'error' })
        console.error(error)
        console.info('Form data:', formData)
      }
    },
    [ExperimentWizardMode.Clone]: async (formData: unknown) => {
      try {
        const { experiment } = formData as { experiment: ExperimentFullNew }
        const receivedExperiment = await ExperimentsApi.create(experiment)
        enqueueSnackbar('Experiment cloned!', { variant: 'success' })
        history.push(`/experiments/${receivedExperiment.experimentId}/code-setup`)
      } catch (error) {
        enqueueSnackbar('Failed to clone experiment 😨 (Form data logged to console.)', { variant: 'error' })
        console.error(error)
        console.info('Form data:', formData)
      }
    },
    [ExperimentWizardMode.Edit]: async (formData: unknown) => {
      try {
        if (!_.isNumber(experimentId)) {
          throw Error('This should never occur: Missing experimentId')
        }
        const { experiment } = formData as { experiment: ExperimentFullNew }
        await ExperimentsApi.put(experimentId, experiment)
        enqueueSnackbar('Experiment Updated!', { variant: 'success' })
        history.push(`/experiments/${experimentId}`)
      } catch (error) {
        enqueueSnackbar(`Failed to update experiment 😨 (Form data logged to console.)`, { variant: 'error' })
        console.error(error)
        console.info('Form data:', formData)
      }
    },
  }
  const onSubmit = onSubmitByExperimentWizardMode[experimentWizardMode]

  const initialExperiment = experiment && experimentToFormData(clonedExperiment(experiment))

  const titleByExperimentWizardMode: Record<ExperimentWizardMode, string> = {
    [ExperimentWizardMode.Create]: 'Create an Experiment',
    [ExperimentWizardMode.Edit]: experiment ? `Editing Experiment: ${experiment?.name || ''}` : '',
    [ExperimentWizardMode.Clone]: experiment ? `Cloning Experiment: ${experiment?.name || ''}` : '',
  }
  const title = titleByExperimentWizardMode[experimentWizardMode]

  return (
    <Layout headTitle={title}>
      <div className={classes.title}>
        <Typography variant='h2'>{title}</Typography>
      </div>
      {isLoading && <LinearProgress className={classes.progress} />}
      {!isLoading && initialExperiment && indexedMetrics && indexedSegments && (
        <ExperimentForm {...{ indexedMetrics, indexedSegments, initialExperiment, onSubmit, completionBag }} />
      )}
    </Layout>
  )
}
