import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import ExperimentPageView, { ExperimentView } from '@/components/ExperimentPageView'
import { isDebugMode } from '@/utils/general'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

export default function ExperimentPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  const debugMode = isDebugMode()
  debug(`ExperimentPage#render ${experimentId}`)

  if (!experimentId) {
    return null
  }

  return <ExperimentPageView {...{ experimentId, debugMode }} view={ExperimentView.Overview} />
}
