// Note: This file was adapted from
// https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript.
import { ServerStyleSheets } from '@material-ui/core/styles'
import NextDocument, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400&display=swap' />
          <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' />
          <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// Enables server-side rendering.
Document.getInitialProps = async (ctx) => {
  // Renders app and page. Then gets the context of the page with collected
  // side-effects.
  const sheets = new ServerStyleSheets()
  const originalRenderPage = ctx.renderPage

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
    })

  const initialProps = await NextDocument.getInitialProps(ctx)

  return {
    ...initialProps,
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  }
}
