import debugFactory from 'debug'
import React from 'react'

import AudiencePanel from '@/components/AudiencePanel'
import ConclusionsPanel from '@/components/ConclusionsPanel'
import GeneralPanel from '@/components/GeneralPanel'
import MetricAssignmentsPanel from '@/components/MetricAssignmentsPanel'
import { ExperimentFull, MetricBare, Segment } from '@/models'

const debug = debugFactory('abacus:components/ExperimentDetails.tsx')

/**
 * Renders the main details of an experiment.
 */
function ExperimentDetails({
  experiment,
  metrics,
  segments,
}: {
  experiment: ExperimentFull
  metrics: MetricBare[]
  segments: Segment[]
}) {
  debug('ExperimentDetails#render')
  return (
    <div>
      <h2>Experiment details</h2>
      <GeneralPanel experiment={experiment} />
      <br />
      <AudiencePanel experiment={experiment} segments={segments} />
      <br />
      <MetricAssignmentsPanel experiment={experiment} metrics={metrics} />
      {experiment.hasConclusionData() && (
        <>
          <br />
          <ConclusionsPanel experiment={experiment} />
        </>
      )}
    </div>
  )
}

export default ExperimentDetails
