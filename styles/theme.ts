import { createMuiTheme } from '@material-ui/core/styles'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    error: React.CSSProperties['color']
  }
}

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        // Remove the last table cell border when in MuiPaper. Otherwise the paper's
        // border butts up with the last table cell's border.
        '.MuiPaper-root': {
          '& .MuiTable-root >': {
            '& .MuiTableBody-root >': {
              '& .MuiTableRow-root:last-child >': {
                '& .MuiTableCell-root': {
                  borderBottom: '0',
                },
              },
            },
          },
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
})

export default theme
