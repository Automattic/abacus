import { AppBar, Container, Theme, Typography } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import React, { ReactNode, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { isTestingProductionConfigInDevelopment } from 'src/config'
import { isDebugMode, toggleDebugMode } from 'src/utils/general'

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

    debugModeBar: {
      flexStretch: 0,
      padding: theme.spacing(1, 0),
      background: '#232323bf',
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

const Layout = ({
  title,
  headTitle,
  children,
}: {
  title?: string
  headTitle?: string
  children?: ReactNode
}): JSX.Element => {
  const classes = useStyles()

  // istanbul ignore next; debug mode only
  const onToggleDebugMode = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (e.shiftKey) {
      toggleDebugMode()
      window.location.reload()
    }
  }

  useEffect(() => {
    document.title = `${title ?? headTitle ?? 'Abacus'} | Abacus`
  }, [title, headTitle])

  return (
    <div className={classes.root}>
      <AppBar position='relative' className={classes.appBar}>
        {
          /* istanbul ignore next; Development mode only */
          isTestingProductionConfigInDevelopment && (
            <div className={classes.productionConfigInDevelopmentBar}>
              <Typography variant='body1'> Using production config in development </Typography>
            </div>
          )
        }
        {
          /* istanbul ignore next; Development mode only */
          isDebugMode() && (
            <div className={classes.debugModeBar}>
              <Typography variant='body1'> Debug Mode </Typography>
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
              <Link to='/experiments'>Experiments</Link>
              <Link to='/experiments/new'>Create Experiment</Link>
              <Link to='/metrics'>Metrics</Link>
              {
                /* istanbul ignore next; Development mode only */
                isDebugMode() && <Link to='/tags'>Tags</Link>
              }
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
          <Typography variant='body1' onDoubleClick={onToggleDebugMode}>
            The Abacus footer. Brought to you by Automattic.
          </Typography>
        </Container>
      </footer>
    </div>
  )
}

export default Layout
