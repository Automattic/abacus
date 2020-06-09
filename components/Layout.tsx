import Container from '@material-ui/core/Container'
import Link from 'next/link'
import Head from 'next/head'
import React, { ReactNode } from 'react'

import { onRenderError } from '@/event-handlers'

import RenderErrorBoundary from './RenderErrorBoundary'
import RenderErrorView from './RenderErrorView'
import ErrorsBox from '@/components/ErrorsBox'

const Layout = ({ title, error, children }: { title: string; error?: Error | null; children?: ReactNode }) => (
  <RenderErrorBoundary onError={onRenderError}>
    {({ renderError }) => {
      return renderError ? (
        <RenderErrorView renderError={renderError} />
      ) : (
        <>
          <Head>
            <title>{title} | Abacus</title>
            <meta charSet='utf-8' />
            <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          </Head>
          <header>
            <Container>
              <nav>
                <Link href='/'>
                  <a>Experiments</a>
                </Link>
                <span>|</span>
                <Link href='/metrics'>
                  <a>Metrics</a>
                </Link>
              </nav>
            </Container>
          </header>
          <Container>
            <h1>{title}</h1>
            {error && <ErrorsBox errors={[error]} />}
            {children}
          </Container>
          <footer>
            <hr />
            <Container>
              <span>The Abacus footer, brought to you by Automattic</span>
            </Container>
          </footer>
        </>
      )
    }}
  </RenderErrorBoundary>
)

export default Layout
