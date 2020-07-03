import { createMuiTheme } from '@material-ui/core/styles'

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

// The base theme is used to provide defaults for other themes to depend on.
// Idea came from
// https://stackoverflow.com/questions/47977618/accessing-previous-theme-variables-in-createmuitheme.
const baseTheme = createMuiTheme()

const theme = createMuiTheme({
  overrides: {
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
          padding: baseTheme.spacing(1),
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
      main: '#1e77a5',
    },
  },
  custom: {
    fonts: {
      monospace: `'Roboto Mono', monospace`,
    },
    fontWeights: {
      monospaceBold: 700,
    },
  },
})

export default theme
