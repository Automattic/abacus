import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import ExperimentPageView, { ExperimentView } from '@/components/ExperimentPageView'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function CodeSetupPage() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  const debugMode = router.query.debug === 'true'
  debug(`ExperimentResultsPage#render ${experimentId}`)

  if (!experimentId) {
    return null
  }

  return <ExperimentPageView {...{ experimentId, debugMode }} view={ExperimentView.CodeSetup} />
}
