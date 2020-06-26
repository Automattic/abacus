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
    }
  }
  interface Theme {
    custom: {
      fonts: Record<string, React.CSSProperties['fontFamily']>
    }
  }
}

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
    MuiTableCell: {
      head: {
        fontWeight: 700,
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
  },
})

export default theme
