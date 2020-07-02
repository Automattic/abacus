import { createMuiTheme } from '@material-ui/core/styles'
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator'

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
        '.MuiPaper-root .MuiTable-root > .MuiTableBody-root > .MuiTableRow-root:last-child > .MuiTableCell-root': {
          borderBottom: '0',
        },
        '.MuiTable-root .MuiTableFooter-root .MuiTableRow-root:last-child > .MuiTableCell-root': {
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
    MuiTablePagination: {
      root: {
        // Copied from @material-ui/core/TableCell
        borderTop: `1px solid ${
          baseTheme.palette.type === 'light'
            ? lighten(fade(baseTheme.palette.divider, 1), 0.88)
            : darken(fade(baseTheme.palette.divider, 1), 0.68)
        }`,
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
