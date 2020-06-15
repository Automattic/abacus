import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode } from 'react'

import ErrorsBox from '@/components/ErrorsBox'
import { onRenderError } from '@/event-handlers'

import RenderErrorBoundary from './RenderErrorBoundary'
import RenderErrorView from './RenderErrorView'

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
          <AppBar color='inherit' position='relative'>
            <div className='top'>
              <Container maxWidth='xl'>
                <img alt='logo' className='app-logo' src='/img/logo.png' />
                <span className='app-name'>Abacus</span>
              </Container>
            </div>
            <div className='bottom'>
              <Container maxWidth='xl'>
                <nav className='app-nav'>
                  <Link href='/'>
                    <a>Experiments</a>
                  </Link>
                  <Link href='/metrics'>
                    <a>Metrics</a>
                  </Link>
                </nav>
              </Container>
            </div>
          </AppBar>
          <Container>
            <h1>{title}</h1>
            {error && <ErrorsBox errors={[error]} />}
            {children}
          </Container>
          <footer>
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
