import { format } from 'date-fns'
import React from 'react'

import { formatIsoUtcOffset } from '@/utils/date'

interface Props {
  value: Date
}

/**
 * Renders the date value in US locale, human readable text.
 */
const DatetimeText = (props: Props) => (
  <span className='whitespace-no-wrap' title={formatIsoUtcOffset(props.value)}>
    {format(props.value, "MMMM d',' yyyy")}
  </span>
)

export default DatetimeText
