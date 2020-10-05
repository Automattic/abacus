import { makeStyles } from '@material-ui/core/styles'
import debugFactory from 'debug'
import { AppProps } from 'next/app'
import { SnackbarProvider } from 'notistack'
import qs from 'querystring'
import React from 'react'
import * as yup from 'yup'

import RenderErrorBoundary from '@/components/RenderErrorBoundary'
import RenderErrorView from '@/components/RenderErrorView'
import { config } from '@/config'
import ThemeProvider from '@/styles/ThemeProvider'
import { getExperimentsAuthInfo } from '@/utils/auth'

const debug = debugFactory('abacus:pages/_app.tsx')

/**
 * Setup Yup UI Validation messages
 *
 * I have taken the defaults (see below) and removed the '${path}' references.
 * Should not be run with tests as we want that extra information.
 *
 * An unfortunate downside to this is that we get less information on run-time errors.
 * If we do want better run-time errors we simply need to wrap the schema in an object
 * before we validate: yup.object({ x: schemaT  }).validate({ x })
 * Then the validation error will have an inner property with both path's and errors.
 *
 * The defaults:
 * https://github.com/jquense/yup/blob/master/src/locale.js
 */
const yupLocale = {
  mixed: {
    default: 'This field is invalid',
    required: 'This field is a required field',
    oneOf: 'This field must be one of the following values: ${values}',
    notOneOf: 'This field must not be one of the following values: ${values}',
    defined: 'This field must be defined',
  },
  string: {
    length: 'This field must be exactly ${length} characters',
    min: 'This field must be at least ${min} characters',
    max: 'This field must be at most ${max} characters',
    matches: 'This field must match the following: "${regex}"',
    email: 'This field must be a valid email',
    url: 'This field must be a valid URL',
    uuid: 'This field must be a valid UUID',
    trim: 'This field must be a trimmed string',
    lowercase: 'This field must be a lowercase string',
    uppercase: 'This field must be a upper case string',
  },
  number: {
    min: 'This field must be greater than or equal to ${min}',
    max: 'This field must be less than or equal to ${max}',
    lessThan: 'This field must be less than ${less}',
    moreThan: 'This field must be greater than ${more}',
    notEqual: 'This field must be not equal to ${notEqual}',
    positive: 'This field must be a positive number',
    negative: 'This field must be a negative number',
    integer: 'This field must be an integer',
  },
  date: {
    min: 'This field must be later than ${min}',
    max: 'This field must be at earlier than ${max}',
  },
  boolean: {},
  object: {
    noUnknown: 'This field has unspecified keys: ${unknown}',
  },
  array: {
    min: 'This field must have at least ${min} items',
    max: 'This field must have less than or equal to ${max} items',
  },
}
yup.setLocale(yupLocale as yup.LocaleObject)

const useStyles = makeStyles({
  app: {
    background: '#f4f6f8',
    minHeight: '100vh', // Ensures background color extends whole length of viewport.
  },
})

const App = React.memo(function App(props: AppProps) {
  debug('App#render')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Component: Route, pageProps: routeProps } = props
  const classes = useStyles()

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles)
    }
  }, [])

  if (typeof window !== 'undefined' && config.experimentApi.needsAuth) {
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
