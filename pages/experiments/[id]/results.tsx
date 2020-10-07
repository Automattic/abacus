import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import ExperimentPageView, { ExperimentView } from '@/components/ExperimentPageView'
import { isDebugMode } from '@/utils/general'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function ResultsPage(): JSX.Element | null {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id) as number | null
  const debugMode = isDebugMode()
  debug(`ExperimentResultsPage#render ${experimentId ?? 'null'}`)

  if (!experimentId) {
    return null
  }

  return <ExperimentPageView {...{ experimentId, debugMode }} view={ExperimentView.Results} />
}
