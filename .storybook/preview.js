import React from 'react'
import { addDecorator } from '@storybook/react'

import ThemeProvider from 'src/styles/ThemeProvider'

addDecorator((storyFn) => <ThemeProvider>{storyFn()}</ThemeProvider>)
