import debugFactory from 'debug'
import React from 'react'

import AudiencePanel from '@/components/AudiencePanel'
import GeneralPanel from '@/components/GeneralPanel'
import { ExperimentFull, Segment } from '@/models'

const debug = debugFactory('abacus:components/ExperimentDetails.tsx')

function ExperimentDetails({ experiment, segments }: { experiment: ExperimentFull; segments: Segment[] }) {
  debug('ExperimentDetails#render')
  return (
    <div>
      <h2>Experiment details</h2>
      <GeneralPanel experiment={experiment} />
      <br />
      <AudiencePanel experiment={experiment} segments={segments} />
    </div>
  )
}

export default ExperimentDetails
