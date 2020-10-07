import debugFactory from 'debug'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const debug = debugFactory('abacus:pages/index.tsx')

const IndexPage = function IndexPage(): JSX.Element | null {
  debug('IndexPage#render')

  // We don't have a home page yet so we redirect to the experiments list
  const router = useRouter()
  useEffect(() => {
    void router.replace('/experiments')
  }, [router])

  return null
}

export default IndexPage
