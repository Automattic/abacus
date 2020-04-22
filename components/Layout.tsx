import Link from 'next/link'
import Head from 'next/head'
import React from 'react'

type Props = {
  title: string;
}

const Layout: React.FunctionComponent<Props> = ({ children, title }) => (
  <div>
    <Head>
      <title>{title} | Abacus</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <header>
      <nav>
        <Link href="/">
          <a>Experiments</a>
        </Link>{' '}
        |{' '}
        <Link href="/metrics">
          <a>Metrics</a>
        </Link>
      </nav>
    </header>
    {children}
    <footer>
      <hr />
      <span>The Abacus footer, brought to you by Automattic</span>
    </footer>
  </div>
)

export default Layout
