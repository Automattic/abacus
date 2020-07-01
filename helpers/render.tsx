import { Queries, render as actualRender, RenderOptions } from '@testing-library/react'
import React from 'react'

import ThemeProvider from '@/styles/ThemeProvider'

const render: typeof actualRender = <Q extends Queries>(ui: React.ReactElement, options?: RenderOptions<Q>) =>
  actualRender((<ThemeProvider>{ui}</ThemeProvider>) as React.ReactElement, options) as ReturnType<typeof actualRender>

export default render
