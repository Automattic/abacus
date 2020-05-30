import debugFactory from 'debug'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Container from 'semantic-ui-react/dist/commonjs/elements/Container'
import { toIntOrNull } from 'qc-to_int'

import AnalysesApi from '@/api/AnalysesApi'
import ErrorsBox from '@/components/ErrorsBox'
import Layout from '@/components/Layout'
import { Analysis } from '@/models'

const debug = debugFactory('abacus:pages/experiments/[id].tsx')

export default function ExperimentPage() {
  const experimentId = toIntOrNull(useRouter().query.id)
  debug(`ExperimentPage#render ${experimentId}`)

  const [error, setError] = useState<Error | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[] | null>(null)

  useEffect(() => {
    if (experimentId == null) {
      setError({ name: 'nullExperimentId', message: 'Experiment not found' })
      return
    }
    setError(null)
    setAnalyses(null)
    AnalysesApi.findByExperimentId(experimentId)
      .then((analyses) => setAnalyses(analyses))
      .catch(setError)
  }, [experimentId])

  return (
    <Layout title='Experiment: insert_name_here'>
      <Container>
        <h1>Experiment insert_name_here</h1>
        {error && <ErrorsBox errors={[error]} />}
        {analyses && (analyses.length === 0 ? <p>No analyses yet.</p> : <pre>{JSON.stringify(analyses, null, 2)}</pre>)}
      </Container>
    </Layout>
  )
}
