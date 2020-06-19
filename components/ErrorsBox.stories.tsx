import React from 'react'

import ThemeProvider from '@/styles/ThemeProvider'

import ErrorsBox from './ErrorsBox'

export default { title: 'Errors' }

const errors = [Error('First error message.'), Error('Second error message.')]

export const withErrors = () => (
  <ThemeProvider>
    <ErrorsBox errors={errors} />
  </ThemeProvider>
)
