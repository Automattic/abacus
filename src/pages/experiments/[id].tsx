import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import ExperimentPageView, { ExperimentView } from 'src/components/ExperimentPageView'
import { isDebugMode } from 'src/utils/general'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

export default function ExperimentPage(): JSX.Element | null {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id) as number | null
  const debugMode = isDebugMode()
  debug(`ExperimentPage#render ${experimentId ?? 'null'}`)

  if (!experimentId) {
    return null
  }

  return <ExperimentPageView {...{ experimentId, debugMode }} view={ExperimentView.Overview} />
}
