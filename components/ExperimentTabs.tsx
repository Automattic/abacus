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
      <Link href={`/experiments/${experiment.experimentId}`}>
        <a>Details</a>
      </Link>
      <span>|</span>
      <Link href={`/experiments/${experiment.experimentId}/results`}>
        <a>Results</a>
      </Link>
    </nav>
  )
}
