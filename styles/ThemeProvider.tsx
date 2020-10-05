import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import React, { ReactNode } from 'react'

import theme from './theme'

/**
 * A pre-configured MUI theme provider.
 */
const ThemeProvider: (children: { children: ReactNode }) => JSX.Element = ({ children }) => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </MuiThemeProvider>
)

export default ThemeProvider
