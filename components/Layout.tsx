import { AppBar, Container, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode } from 'react'

import ErrorsBox from '@/components/ErrorsBox'
import { onRenderError } from '@/event-handlers'

import RenderErrorBoundary from './RenderErrorBoundary'
import RenderErrorView from './RenderErrorView'

const useStyles = makeStyles(
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },

    // AppBar
    appBar: {
      flexStretch: 0,
    },
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

    // Content
    content: {
      flex: '1 0',
    },
    contentTitle: {
      margin: '1rem 0',
    },

    // Footer
    footer: {
      flexShrink: 0,
      padding: '1rem 0',
    },
  }),
)

const Layout = ({ title, error, children }: { title: string; error?: Error | null; children?: ReactNode }) => {
  const classes = useStyles()
  return (
    <RenderErrorBoundary onError={onRenderError}>
      {({ renderError }) => {
        return renderError ? (
          <RenderErrorView renderError={renderError} />
        ) : (
          <div className={classes.root}>
            <Head>
              <title>{title} | Abacus</title>
              <meta charSet='utf-8' />
              <meta name='viewport' content='initial-scale=1.0, width=device-width' />
            </Head>
            <AppBar position='relative' className={classes.appBar}>
              <div className={classes.appBarTop}>
                <Container maxWidth='xl'>
                  <img alt='logo' className={classes.appLogo} src='/img/logo.png' />
                  <a href='/' className={classes.appName}>
                    Abacus
                  </a>
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
            <Container className={classes.content}>
              <Typography variant='h4' component='h1' className={classes.contentTitle}>
                {title}
              </Typography>
              {error && <ErrorsBox errors={[error]} />}
              {children}
            </Container>
            <footer className={classes.footer}>
              <Container>
                <Typography variant='body1'>The Abacus footer, brought to you by Automattic.</Typography>
              </Container>
            </footer>
          </div>
        )
      }}
    </RenderErrorBoundary>
  )
}

export default Layout
