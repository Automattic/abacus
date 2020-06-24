import debugFactory from 'debug'
import React from 'react'

import AudiencePanel from '@/components/AudiencePanel'
import { ExperimentFull, Segment } from '@/models'
import { formatIsoUtcOffset } from '@/utils/formatters'

const debug = debugFactory('abacus:components/ExperimentDetails.tsx')

function ExperimentDetails({ experiment, segments }: { experiment: ExperimentFull; segments: Segment[] }) {
  debug('ExperimentDetails#render')
  return (
    <div>
      <h2>Experiment details</h2>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{experiment.name}</td>
          </tr>
          <tr>
            <td>P2 Link</td>
            <td>
              <a href={experiment.p2Url} rel='noopener noreferrer' target='_blank'>
                P2
              </a>
            </td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{experiment.description}</td>
          </tr>
          <tr>
            <td>Start</td>
            <td>{formatIsoUtcOffset(experiment.startDatetime)}</td>
          </tr>
          <tr>
            <td>End</td>
            <td>{formatIsoUtcOffset(experiment.endDatetime)}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>{experiment.status}</td>
          </tr>
          <tr>
            <td>Platform</td>
            <td>{experiment.platform}</td>
          </tr>
        </tbody>
      </table>
      <AudiencePanel experiment={experiment} segments={segments} />
    </div>
  )
}

export default ExperimentDetails
