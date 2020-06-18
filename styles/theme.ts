import { createMuiTheme } from '@material-ui/core/styles'

declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    error: React.CSSProperties['color']
  }
}

const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#194661',
      },
    },
  },
  palette: {
    background: {
      error: '#f8d7da',
    },
  },
})

export default theme
