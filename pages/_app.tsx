import { makeStyles } from '@material-ui/core/styles'
import debugFactory from 'debug'
import { AppProps } from 'next/app'
import { SnackbarProvider } from 'notistack'
import qs from 'querystring'
import React from 'react'

import RenderErrorBoundary from '@/components/RenderErrorBoundary'
import RenderErrorView from '@/components/RenderErrorView'
import ThemeProvider from '@/styles/ThemeProvider'
import { getAuthClientId, getExperimentsAuthInfo, saveExperimentsAuthInfo } from '@/utils/auth'

const debug = debugFactory('abacus:pages/_app.tsx')

const useStyles = makeStyles({
  app: {
    background: '#f4f6f8',
    minHeight: '100vh', // Ensures background color extends whole length of viewport.
  },
})

const App = React.memo(function App(props: AppProps) {
  debug('App#render')
  const { Component: Route, pageProps: routeProps } = props
  const classes = useStyles()

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  if (typeof window !== 'undefined') {
    // Inject a fake auth token to skip authentication in non-production contexts.
    // This is a temporary solution. Ideally, we should test the full authentication flow in every environment.
    if (window.location.host !== 'experiments.a8c.com') {
      saveExperimentsAuthInfo({
        accessToken: 'fake_token',
        expiresAt: Date.parse('2100-01-01'),
        scope: 'global',
        type: 'bearer',
      })
    }

    // Prompt user for authorization if we don't have auth info.
    const experimentsAuthInfo = getExperimentsAuthInfo()
    if (!experimentsAuthInfo) {
      const authPath = 'https://public-api.wordpress.com/oauth2/authorize'
      const authQuery = {
        client_id: getAuthClientId(window.location.host),
        redirect_uri: `${window.location.origin}/auth`,
        response_type: 'token',
        scope: 'global',
      }

      const authUrl = `${authPath}?${qs.stringify(authQuery)}`
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
                <Route {...routeProps} />
              </div>
            </SnackbarProvider>
          )}
        </ThemeProvider>
      )}
    </RenderErrorBoundary>
  )
})

export default App
