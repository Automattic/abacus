import React from 'react'

import LabelValuePanel from '@/components/LabelValuePanel'
import { ExperimentFull } from '@/models'

/**
 * Renders the conclusion information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the conclusion information.
 */
function ConclusionsPanel({ experiment }: { experiment: ExperimentFull }) {
  const deployedVariation = experiment.getDeployedVariation()
  const data = [
    { label: 'Reason the experiment ended', value: experiment.endReason },
    {
      label: 'Conclusion URL',
      value: !!experiment.conclusionUrl && (
        <a href={experiment.conclusionUrl} rel='noopener noreferrer' target='_blank'>
          {experiment.conclusionUrl}
        </a>
      ),
    },
    { label: 'Deployed variation', value: deployedVariation?.name },
  ]
  return <LabelValuePanel data={data} title='Conclusions' />
}

export default ConclusionsPanel
