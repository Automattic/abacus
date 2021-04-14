import { differenceInHours } from 'date-fns'

import { AnalysisStrategy, AssignmentCacheStatus, ExperimentFull, Platform, Status, Variation } from './schemas'

/**
 * Return the deployed variation if one has been selected, otherwise `null`.
 *
 * @throws {Error} If a `deployedVariationId` is set but cannot be found in the
 *   variations.
 */
export function getDeployedVariation(experiment: ExperimentFull): null | Variation {
  let deployedVariation = null

  if (typeof experiment.deployedVariationId === 'number') {
    deployedVariation = experiment.variations.find(
      (variation) => experiment.deployedVariationId === variation.variationId,
    )

    if (!deployedVariation) {
      throw Error(
        `Failed to resolve the deployed variation with ID ${experiment.deployedVariationId} for experiment with ID ${experiment.experimentId}.`,
      )
    }
  }

  return deployedVariation
}

/**
 * Return the primary metric assignment ID for this experiment if one exists.
 */
export function getPrimaryMetricAssignmentId(experiment: ExperimentFull): number | null {
  return experiment.metricAssignments.find((metricAssignment) => metricAssignment.isPrimary)?.metricAssignmentId ?? null
}

/**
 * Return this experiment's default analysis strategy, which depends on the existence of exposureEvents.
 */
export function getDefaultAnalysisStrategy(experiment: ExperimentFull): AnalysisStrategy {
  return experiment.exposureEvents ? AnalysisStrategy.PpNaive : AnalysisStrategy.MittNoSpammersNoCrossovers
}

export const PlatformToHuman: Record<Platform, string> = {
  [Platform.Akismet]: 'Spam protection for WordPress',
  [Platform.Calypso]: 'Calypso front-end',
  [Platform.Email]: 'Guides and other email systems',
  [Platform.Jetpack]: 'Jetpack front-end',
  [Platform.Lohp]: 'WordPress.com logged out homepage',
  [Platform.Pipe]: 'Machine learning pipeline',
  [Platform.Wpandroid]: 'WordPress Android app',
  [Platform.Wpcom]: 'WordPress.com back-end',
  [Platform.Wpios]: 'WordPress iOS app',
  [Platform.WooCommerce]: 'WooCommerce',
}

export const AssignmentCacheStatusToHuman: Record<AssignmentCacheStatus, string> = {
  [AssignmentCacheStatus.Fresh]: '✅ Fresh: Production cache is up to date, but manual sandbox updates may be needed',
  [AssignmentCacheStatus.Missing]: '❌️ Missing: Expected for new, renamed, or disabled experiments',
  [AssignmentCacheStatus.Stale]: '❌️ Stale: Recent changes take up to ten minutes to propagate',
}

/**
 * Returns an experiment's run time in hours.
 */
export function getExperimentRunHours(experiment: ExperimentFull): number {
  if (experiment.status === Status.Staging) {
    return 0
  }

  const maybeEndDate = experiment.status === Status.Running ? new Date() : experiment.endDatetime
  return differenceInHours(maybeEndDate, experiment.startDatetime)
}
