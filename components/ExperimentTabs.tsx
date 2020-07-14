import { createStyles, makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

import { ExperimentFull } from '@/lib/schemas'

const useStyles = makeStyles(() =>
  createStyles({
    tab: {
      minWidth: 110,
    },
  }),
)

function LinkTab({ as, label, url, value }: { as?: string; label: ReactNode; url: string; value: string }) {
  const classes = useStyles()
  const router = useRouter()
  return (
    <Tab
      className={classes.tab}
      label={label}
      onClick={
        /* istanbul ignore next; to be handled by an e2e test */
        () => {
          router.push(url, as)
        }
      }
      value={value}
    />
  )
}

/**
 * Experiment tab component. Used to switch between the various sections of the
 * experiment information.
 */
export default function ExperimentTabs({
  className,
  experiment,
  tab,
}: {
  className?: string
  experiment: ExperimentFull
  tab: 'details' | 'results' | 'snippets'
}) {
  return (
    <Tabs className={className} value={tab}>
      <LinkTab as={`/experiments/${experiment.experimentId}`} label='Details' value='details' url='/experiments/[id]' />
      <LinkTab
        as={`/experiments/${experiment.experimentId}/results`}
        label='Results'
        value='results'
        url='/experiments/[id]/results'
      />
      <LinkTab
        as={`/experiments/${experiment.experimentId}/snippets`}
        label='Snippets'
        value='snippets'
        url='/experiments/[id]/snippets'
      />
    </Tabs>
  )
}
