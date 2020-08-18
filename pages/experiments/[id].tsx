import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import ExperimentPageView, { ExperimentView } from '@/components/ExperimentPageView'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

export default function ExperimentPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  const debugMode = router.query.debug === 'true'
  debug(`ExperimentPage#render ${experimentId}`)

  if (!experimentId) {
    return null
  }

  return <ExperimentPageView {...{ experimentId, debugMode }} view={ExperimentView.Details} />
}
