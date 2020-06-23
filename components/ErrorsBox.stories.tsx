import React from 'react'

import ErrorsBox from './ErrorsBox'

export default { title: 'Errors' }

const errors = [Error('First error message.'), Error('Second error message.')]

export const withErrors = () => <ErrorsBox errors={errors} />
