import parseISO from 'date-fns/fp/parseISO'
import { Experiment, Platform, Status } from '@/models/index'
import { getExperimentsAuthInfo } from '@/utils/auth'

import UnauthorizedError from './UnauthorizedError'

interface RawExperiment {
  end_datetime: string
  experiment_id: number
  name: string
  owner_login: string
  platform: string
  start_datetime: string
}

const DEVELOPMENT_API_URL_ROOT = 'https://virtserver.swaggerhub.com/yanir/experiments/0.1.0'
const PRODUCTION_API_URL_ROOT = 'https://public-api.wordpress.com/wpcom/v2/experiments/0.1.0'

function resolveApiUrlRoot() {
  return window.location.host === 'experiments.a8c.com' ? PRODUCTION_API_URL_ROOT : DEVELOPMENT_API_URL_ROOT
}

function resolvePlatform(input: string): Platform {
  let platform = Platform.Calypso

  if (input === 'calypso') {
    platform = Platform.Calypso
  } else if (input === 'wpcom') {
    platform = Platform.Wpcom
  }

  return platform
}

/**
 * Finds all the available experiments.
 *
 * Note: Be sure to handle any errors that may be thrown.
 *
 * @throws UnauthorizedError
 */
async function findAll(): Promise<Experiment[]> {
  const apiUrlRoot = resolveApiUrlRoot()

  const accessToken = getExperimentsAuthInfo()?.accessToken
  if (!accessToken) {
    throw new UnauthorizedError()
  }

  const fetchUrl = `${apiUrlRoot}/experiments`
  return fetch(fetchUrl, {
    method: 'GET',
    headers:
      apiUrlRoot === PRODUCTION_API_URL_ROOT ? new Headers({ Authorization: `Bearer ${accessToken}` }) : undefined,
  })
    .then((response) => response.json())
    .then((result) => {
      const rawExperiments: RawExperiment[] = result.experiments

      // TODO: Centralize this transformation logic.
      // TODO: Try to make transformation less manual. For example, schema-driven.
      const experiments: Experiment[] = rawExperiments.map((re) => {
        const e = {
          description: '', // TODO: Get from API. Currently not available, but required by Experiment interface.
          endDatetime: parseISO(re.end_datetime),
          experimentId: re.experiment_id,
          existingUsersAllowed: true, // TODO: Get from API. Currently not available, but required by Experiment interface.
          metricAssignments: [], // TODO: Get from API. Currently not available, but required by Experiment interface.
          name: re.name,
          p2Url: 'https://betterexperiments.a8c.com/2020/05/13/example', // TODO: Get from API. Currently not available, but required by Experiment interface.
          platform: resolvePlatform(re.platform),
          ownerLogin: re.owner_login,
          segmentAssignments: [], // TODO: Get from API. Currently not available, but required by Experiment interface.
          startDatetime: parseISO(re.start_datetime),
          status: Status.Staging, // TODO: Get from API. Currently not available, but required by Experiment interface.
          variations: [], // TODO: Get from API. Currently not available, but required by Experiment interface.
        }
        return e
      })
      return experiments
    })
}

const ExperimentsApi = {
  findAll,
}

export default ExperimentsApi
