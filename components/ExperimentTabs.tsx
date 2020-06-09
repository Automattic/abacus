import Link from 'next/link'
import React from 'react'
import { ExperimentFull } from '@/models'

/**
 * Experiment tab component. Used to switch between experiment details and results.
 */
export default function ExperimentTabs({ experiment }: { experiment: ExperimentFull | null }) {
  // TODO: Render using Material UI tabs and add tests
  if (!experiment) {
    return <></>
  }
  return (
    <nav>
      <Link as={`/experiments/${experiment.experimentId}`} href='/experiments/[id]'>
        <a>Details</a>
      </Link>
      <span>|</span>
      <Link as={`/experiments/${experiment.experimentId}/results`} href='/experiments/[id]/results'>
        <a>Results</a>
      </Link>
    </nav>
  )
}
