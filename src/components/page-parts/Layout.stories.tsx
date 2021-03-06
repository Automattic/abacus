import React from 'react'
import { StaticRouter } from 'react-router-dom'

import Layout from './Layout'

export default { title: 'Layout' }

export const withChildren = (): JSX.Element => (
  <StaticRouter>
    <Layout title='Storybook'>
      <div>
        <p>I represent the children.</p>
        <p>
          Because Layout contains Next.js Links, you will find an error in the console due to the rest of Next.js being
          rendered higher in the tree. I do not think it is important enough to find a workaround at this point. So,
          remove this Layout story once real stories for isolated components have been created.
        </p>
      </div>
    </Layout>
  </StaticRouter>
)
