import Link from 'next/link'
import Head from 'next/head'
import React, { ReactNode } from 'react'

import { onRenderError } from '@/event-handlers/index'

import RenderErrorBoundary from './RenderErrorBoundary'
import RenderErrorView from './RenderErrorView'

type Props = {
  children?: ReactNode
  title: string
}

const Layout = ({ children, title }: Props) => (
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
            <nav>
              <Link href='/'>
                <a>Experiments</a>
              </Link>
              <span>|</span>
              <Link href='/metrics'>
                <a>Metrics</a>
              </Link>
            </nav>
          </header>
          {children}
          <footer>
            <hr />
            <span>The Abacus footer, brought to you by Automattic</span>
          </footer>
        </>
      )
    }}
  </RenderErrorBoundary>
)

export default Layout
