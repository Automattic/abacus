import { makeStyles } from '@material-ui/core/styles'
import debugFactory from 'debug'
import { SnackbarProvider } from 'notistack'
import qs from 'querystring'
import React from 'react'

import RenderErrorBoundary from 'src/components/page-parts/RenderErrorBoundary'
import RenderErrorView from 'src/components/page-parts/RenderErrorView'
import { config } from 'src/config'
import ThemeProvider from 'src/styles/ThemeProvider'
import { getExperimentsAuthInfo } from 'src/utils/auth'

import Routes from './Routes'

const debug = debugFactory('abacus:pages/_app.tsx')

const useStyles = makeStyles({
  app: {
    background: '#f4f6f8',
    minHeight: '100vh', // Ensures background color extends whole length of viewport.
  },
})

function App(): JSX.Element {
  debug('App#render')
  const classes = useStyles()

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  if (config.experimentApi.needsAuth && window.location.pathname !== '/auth') {
    // Prompt user for authorization if we don't have auth info.
    const experimentsAuthInfo = getExperimentsAuthInfo()
    if (!experimentsAuthInfo) {
      const authQuery = {
        client_id: config.experimentApi.authClientId,
        redirect_uri: `${window.location.origin}/auth`,
        response_type: 'token',
        scope: 'global',
      }

      const authUrl = `${config.experimentApi.authPath}?${qs.stringify(authQuery)}`
      window.location.replace(authUrl)
    }
  }

  return (
    <RenderErrorBoundary>
      {({ renderError }) => (
        <ThemeProvider>
          {renderError ? (
            <RenderErrorView renderError={renderError} />
          ) : (
            <SnackbarProvider preventDuplicate>
              <div className={classes.app}>
                <Routes />
              </div>
            </SnackbarProvider>
          )}
        </ThemeProvider>
      )}
    </RenderErrorBoundary>
  )
}

export default App
