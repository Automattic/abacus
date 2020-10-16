import { createMuiTheme } from '@material-ui/core/styles'
import React from 'react'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    error: React.CSSProperties['color']
  }
}

declare module '@material-ui/core/styles' {
  interface ThemeOptions {
    custom: {
      fonts: Record<string, React.CSSProperties['fontFamily']>
      fontWeights: Record<string, React.CSSProperties['fontWeight']>
    }
  }
  interface Theme {
    custom: {
      fonts: Record<string, React.CSSProperties['fontFamily']>
      fontWeights: Record<string, React.CSSProperties['fontWeight']>
    }
  }
}

const headingDefaults = {
  fontWeight: 500,
  lineHeight: 1.2,
}

const monospaceFontStack = `'Roboto Mono', monospace`

// The base theme is used to provide defaults for other themes to depend on.
// Idea came from
// https://stackoverflow.com/questions/47977618/accessing-previous-theme-variables-in-createmuitheme.
const baseTheme = createMuiTheme()

const theme = createMuiTheme({
  overrides: {
    MuiInputBase: {
      root: {
        fontFamily: monospaceFontStack,
      },
    },
    MuiCssBaseline: {
      '@global': {
        // Remove the last table cell border of a top-level MuiTable when in MuiPaper.
        // Otherwise the paper's border butts up with the last table cell's border.
        // Note: The child combinators are required to avoid selecting nested tables.
        '.MuiPaper-root > .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root:last-child > .MuiTableCell-root': {
          borderBottom: '0',
        },
        // Remove the last table cell border when in a nested MuiTable. Otherwise the parent
        // table's cell's border butts up with the nested table's last cell border.
        // Note: Only interested in removing the table cell border from the table body and
        // not from the table head.
        // Note: This is a known issue and is scheduled to be addressed in MUI v5. See
        // https://github.com/mui-org/material-ui/pull/20809.
        '.MuiTable-root .MuiTable-root .MuiTableBody-root .MuiTableRow-root:last-child > .MuiTableCell-root': {
          borderBottom: '0',
        },
      },
    },
    MuiContainer: {
      root: {
        // Make the padding smaller at narrow window sizes.
        [baseTheme.breakpoints.down('xs')]: {
          paddingLeft: baseTheme.spacing(1),
          paddingRight: baseTheme.spacing(1),
        },
      },
    },
    MuiTableCell: {
      head: {
        fontWeight: 700,
      },
      root: {
        // Make the padding smaller at narrow window sizes.
        [baseTheme.breakpoints.down('xs')]: {
          padding: baseTheme.spacing(1),
        },
      },
    },
  },
  palette: {
    background: {
      error: '#f8d7da',
    },
    primary: {
      main: '#194661',
    },
    secondary: {
      main: '#2e7d32',
      light: '#60ad5e',
      dark: '#005005',
    },
  },
  typography: {
    h1: {
      ...headingDefaults,
      fontSize: '2.25rem',
    },
    h2: {
      ...headingDefaults,
      fontSize: '2rem',
    },
    h3: {
      ...headingDefaults,
      fontSize: '1.75rem',
    },
    h4: {
      ...headingDefaults,
      fontSize: '1.5rem',
    },
    h5: {
      ...headingDefaults,
      fontSize: '1.25rem',
    },
    h6: {
      ...headingDefaults,
      fontSize: '1rem',
    },
  },
  custom: {
    fonts: {
      monospace: monospaceFontStack,
    },
    fontWeights: {
      monospaceBold: 700,
    },
  },
})

export default theme
