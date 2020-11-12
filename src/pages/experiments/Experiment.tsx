import debugFactory from 'debug'
import React from 'react'
import { useParams } from 'react-router-dom'
import * as yup from 'yup'

import ExperimentPageView, { ExperimentView } from 'src/components/ExperimentPageView'
import { isDebugMode, parseIdSlug } from 'src/utils/general'

const debug = debugFactory('abacus:pages/experiments/Experiment.tsx')

export default function Experiment(): JSX.Element | null {
  const { experimentIdSlug, view: viewRaw = ExperimentView.Overview } = useParams<{
    experimentIdSlug: string
    view: string
  }>()
  const experimentId = parseIdSlug(experimentIdSlug)
  const view = yup.string().defined().oneOf(Object.values(ExperimentView)).validateSync(viewRaw)
  const debugMode = isDebugMode()

  debug(`ExperimentPage#render experimentId:%o view:%o debugMode:%o`, experimentId, view, debugMode)

  return <ExperimentPageView {...{ experimentId, debugMode, view }} />
}
