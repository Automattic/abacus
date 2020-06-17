import AppBar from '@material-ui/core/AppBar'
import Container from '@material-ui/core/Container'
import { makeStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode } from 'react'

import ErrorsBox from '@/components/ErrorsBox'
import { onRenderError } from '@/event-handlers'

import RenderErrorBoundary from './RenderErrorBoundary'
import RenderErrorView from './RenderErrorView'

const useStyles = makeStyles({
  appBarBottom: {
    background: '#fff',
    padding: '0.75rem 0',
  },
  appBarTop: {
    padding: '1rem 0',
  },
  appLogo: {
    width: 24,
    marginRight: '0.5rem',
  },
  appName: {
    color: '#fff',
    fontFamily: 'Comfortaa, cursive',
    fontSize: '1.5rem',
  },
  appNav: {
    '& a': {
      color: '#4f4f4f',
      fontFamily: 'Roboto, sans-serif',
      marginRight: '1rem',
      textDecoration: 'none',
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
})

const Layout = ({ title, error, children }: { title: string; error?: Error | null; children?: ReactNode }) => {
  const classes = useStyles()
  return (
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
            <AppBar position='relative'>
              <div className={classes.appBarTop}>
                <Container maxWidth='xl'>
                  <img alt='logo' className={classes.appLogo} src='/img/logo.png' />
                  <span className={classes.appName}>Abacus</span>
                </Container>
              </div>
              <div className={classes.appBarBottom}>
                <Container maxWidth='xl'>
                  <nav className={classes.appNav}>
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
}

export default Layout
