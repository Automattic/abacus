import { format } from 'date-fns'
import React from 'react'

import { formatIsoUtcOffset } from '@/utils/date'

/**
 * Renders the date value in US locale, human readable text.
 */
const DatetimeText = (props: { value: Date }) => (
  <span className='whitespace-no-wrap' title={formatIsoUtcOffset(props.value)}>
    {format(props.value, "MMMM d',' yyyy")}
  </span>
)

export default DatetimeText
