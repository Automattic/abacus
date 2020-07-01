import Grid from '@material-ui/core/Grid'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import debugFactory from 'debug'
import React, { useState } from 'react'

import AudiencePanel from '@/components/AudiencePanel'
import ConclusionsPanel from '@/components/ConclusionsPanel'
import ExperimentToolbar, { ExperimentToolbarMode } from '@/components/ExperimentToolbar'
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
  const [mode, setMode] = useState<ExperimentToolbarMode>('view')
  const theme = useTheme()
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'))

  /* istanbul ignore next; to be handled by an e2e test */
  function handleCancel() {
    // TODO: If form is dirty, then prompt for cancellation.
    setMode('view')
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleConclude() {
    setMode('conclude')
    setTimeout(() => {
      window.alert('TODO: Handle conclude mode.')
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleDisable() {
    setMode('disable')
    setTimeout(() => {
      const disable = window.confirm('Are you sure you want to disable?')

      if (disable) {
        setTimeout(() => {
          window.alert('TODO: Handle disable mode.')
          setMode('view')
        }, 100)
      } else {
        setMode('view')
      }
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleEdit() {
    setMode('edit')
    setTimeout(() => {
      window.alert('TODO: Handle edit mode.')
    }, 1)
  }

  /* istanbul ignore next; to be handled by an e2e test */
  function handleSave() {
    if (mode === 'conclude') {
      window.alert('TODO: save conclusions')
    } else if (mode === 'edit') {
      window.alert('TODO: update details')
    }
    setMode('view')
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ExperimentToolbar
          experiment={experiment}
          mode={mode}
          onCancel={handleCancel}
          onConclude={handleConclude}
          onDisable={handleDisable}
          onEdit={handleEdit}
          onSave={handleSave}
          section='details'
        />
      </Grid>
      <Grid item xs={12} lg={7}>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <GeneralPanel experiment={experiment} />
          </Grid>
          {isMdDown && (
            <Grid item>
              <AudiencePanel experiment={experiment} segments={segments} />
            </Grid>
          )}
          <Grid item>
            <MetricAssignmentsPanel experiment={experiment} metrics={metrics} />
          </Grid>
          {experiment.hasConclusionData() && (
            <Grid item>
              <ConclusionsPanel experiment={experiment} />
            </Grid>
          )}
        </Grid>
      </Grid>
      {!isMdDown && (
        <Grid item lg={5}>
          <AudiencePanel experiment={experiment} segments={segments} />
        </Grid>
      )}
    </Grid>
  )
}

export default ExperimentDetails
