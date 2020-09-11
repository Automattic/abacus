import { AppBar, Container, Theme, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Head from 'next/head'
import Link from 'next/link'
import React, { ReactNode } from 'react'

import { isTestingProductionConfigInDevelopment } from '@/config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },

    productionConfigInDevelopmentBar: {
      flexStretch: 0,
      padding: theme.spacing(1, 0),
      background: theme.palette.error.light,
      color: theme.palette.error.contrastText,
      textTransform: 'uppercase',
      textAlign: 'center',
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
    appLogotype: {
      textDecoration: 'none',
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
      margin: theme.spacing(3, 0, 2, 0),
      color: theme.palette.grey.A700,
    },

    // Footer
    footer: {
      flexShrink: 0,
      padding: '1rem 0',
    },
  }),
)

const Layout = ({ title, headTitle, children }: { title?: string; headTitle?: string; children?: ReactNode }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Head>
        <title>{title ?? /* istanbul ignore next; trivial */ headTitle} | Abacus</title>
        <meta charSet='utf-8' />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <AppBar position='relative' className={classes.appBar}>
        {
          /* istanbul ignore next; Development mode only */
          isTestingProductionConfigInDevelopment && (
            <div className={classes.productionConfigInDevelopmentBar}>
              <Typography variant='body1'> Using production config in development </Typography>
            </div>
          )
        }
        <div className={classes.appBarTop}>
          <Container component='a' className={classes.appLogotype} href='/'>
            <img alt='logo' className={classes.appLogo} src='/img/logo.png' />
            <span className={classes.appName}>Abacus</span>
          </Container>
        </div>
        <div className={classes.appBarBottom}>
          <Container>
            <nav className={classes.appNav}>
              <Link href='/experiments'>
                <a>Experiments</a>
              </Link>
              <Link href='/experiments/new'>
                <a>Create Experiment</a>
              </Link>
              <Link href='/metrics'>
                <a>Metrics</a>
              </Link>
            </nav>
          </Container>
        </div>
      </AppBar>
      <Container className={classes.content}>
        {title && (
          <Typography variant='h2' className={classes.contentTitle}>
            {title}
          </Typography>
        )}
        {children}
      </Container>
      <footer className={classes.footer}>
        <Container>
          <Typography variant='body1'>The Abacus footer. Brought to you by Automattic.</Typography>
        </Container>
      </footer>
    </div>
  )
}

export default Layout
