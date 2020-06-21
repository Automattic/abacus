import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { toIntOrNull } from 'qc-to_int'
import React from 'react'

import ExperimentsPage from '@/components/ExperimentsPage'

const debug = debugFactory('abacus:pages/experiments/[id]/results.tsx')

export default function ExperimentResultsRoute() {
  const router = useRouter()
  const experimentId = toIntOrNull(router.query.id)
  debug(`ExperimentResultsRoute#render ${experimentId}`)

  return <ExperimentsPage debugMode={router.query.debug === 'true'} experimentId={experimentId} section='results' />
}
