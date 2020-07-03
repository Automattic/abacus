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

const headingDefaults = {
  fontWeight: 500,
  lineHeight: 1.2,
}

// The base theme is used to provide defaults for other themes to depend on.
// Idea came from
// https://stackoverflow.com/questions/47977618/accessing-previous-theme-variables-in-createmuitheme.
const baseTheme = createMuiTheme()

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        // Remove the last table cell border of a MuiTable when in MuiPaper. Otherwise the
        // paper's border butts up with the last table cell's border.
        // Also removes the last table cell border when in a nested MuiTable. Otherwise the
        // parent table's cell's border butts up with the nested table's last cell border.
        // Note: Only interested in removing the table cell border from the table body and
        // table footer but not from the table head.
        // Note: This is a known issue and is scheduled to be addressed in MUI v5. See
        // https://github.com/mui-org/material-ui/pull/20809.
        // Note: The child combinators are required to avoid selecting nested tables.
        [[
          '.MuiPaper-root .MuiTable-root .MuiTableBody-root > .MuiTableRow-root:last-child > .MuiTableCell-root',
          '.MuiPaper-root .MuiTable-root .MuiTableFooter-root > .MuiTableRow-root:last-child > .MuiTableCell-root',
        ].join(', ')]: {
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
    MuiTableFooter: {
      root: {
        // Adds back the border that is removed by the global MuiTableCell-root rules in
        // `theme.overrides.MuiCssBaseline@global`.
        // Copied from @material-ui/core/TableCell
        borderTop: `1px solid ${
          baseTheme.palette.type === 'light'
            ? lighten(fade(baseTheme.palette.divider, 1), 0.88)
            : darken(fade(baseTheme.palette.divider, 1), 0.68)
        }`,
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
      monospace: `'Roboto Mono', monospace`,
    },
    fontWeights: {
      monospaceBold: 700,
    },
  },
})

export default theme
