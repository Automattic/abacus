import React from 'react'
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom'

import AuthCallback from 'src/pages/AuthCallback'
import Experiment from 'src/pages/experiments/Experiment'
import Experiments from 'src/pages/experiments/Experiments'
import ExperimentsAgGrid from 'src/pages/experiments/ExperimentsAgGrid'
import ExperimentWizard, { ExperimentWizardMode } from 'src/pages/experiments/ExperimentWizard'
import Metrics from 'src/pages/Metrics'
import Tags from 'src/pages/Tags'

/**
 * Let's keep routing simple and minimal.
 * - Do not use dynamic or nested routing!
 * - Get all your route information at the top level.
 * - Try not to delete or change an existing route: comment a route as deprecated and redirect.
 */
export default function Routes(): JSX.Element {
  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Redirect to='/experiments' />
        </Route>

        <Route path='/auth' exact>
          <AuthCallback />
        </Route>

        <Route path='/experiments' exact>
          <Experiments />
        </Route>

        <Route path='/experiments-ag' exact>
          <ExperimentsAgGrid />
        </Route>

        <Route path='/experiments/new' exact>
          <ExperimentWizard experimentWizardMode={ExperimentWizardMode.Create} />
        </Route>
        <Route
          path='/experiments/:experimentIdSlug'
          render={({ location, history }) => {
            history.replace(`${location.pathname}/overview`)
            return undefined
          }}
          exact
        />
        <Route path='/experiments/:experimentIdSlug/wizard-edit' exact>
          <ExperimentWizard experimentWizardMode={ExperimentWizardMode.Edit} />
        </Route>
        <Route path='/experiments/:experimentIdSlug/clone' exact>
          <ExperimentWizard experimentWizardMode={ExperimentWizardMode.Clone} />
        </Route>
        <Route path='/experiments/:experimentIdSlug/:view' exact>
          <Experiment />
        </Route>

        <Route path='/metrics' exact>
          <Metrics />
        </Route>

        <Route path='/tags' exact>
          <Tags />
        </Route>
      </Switch>
    </Router>
  )
}
