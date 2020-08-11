import { createStyles, makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'

import { ExperimentView } from './ExperimentPageView'

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
  experimentId,
  tab,
}: {
  className?: string
  experimentId: number
  tab: ExperimentView
}) {
  return (
    <Tabs className={className} value={tab}>
      <LinkTab
        label='Overview'
        value={ExperimentView.Overview}
        url='/experiments/[id]'
        as={`/experiments/${experimentId}`}
      />
      <LinkTab
        label='Results'
        value={ExperimentView.Results}
        url='/experiments/[id]/results'
        as={`/experiments/${experimentId}/results`}
      />
      <LinkTab
        label='Code Setup'
        value={ExperimentView.CodeSetup}
        url='/experiments/[id]/code-setup'
        as={`/experiments/${experimentId}/code-setup`}
      />
    </Tabs>
  )
}
