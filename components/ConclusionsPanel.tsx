import { createStyles, makeStyles } from '@material-ui/core/styles'
import React from 'react'

import LabelValuePanel from '@/components/LabelValuePanel'
import { ExperimentFull } from '@/models'

const useStyles = makeStyles(() =>
  createStyles({
    conclusionless: {
      opacity: 0.6,
    },
  }),
)

/**
 * Renders the conclusion information of an experiment in a panel component.
 *
 * @param props.experiment - The experiment with the conclusion information.
 */
function ConclusionsPanel({ experiment }: { experiment: ExperimentFull }) {
  const classes = useStyles()
  const deployedVariation = experiment.variations.find(
    (variation) => experiment.deployedVariationId === variation.variationId,
  )
  const isConclusionless = !(experiment.endReason || experiment.conclusionUrl || deployedVariation)
  const data = [
    { label: 'Description for ending experiment', value: experiment.endReason },
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
  return <LabelValuePanel className={isConclusionless ? classes.conclusionless : ''} data={data} title='Conclusions' />
}

export default ConclusionsPanel
