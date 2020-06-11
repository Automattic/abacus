import React from 'react'

const TIME_PART_RE = /T\d{2}:\d{2}:\d{2}(?:\.\d+(?:Z)?)?/

/**
 * Renders the date value in ISO 8601 format UTC.
 */
const DatetimeText = (props: { value: Date; time?: boolean }) => {
  const datetimeText = props.value.toLocaleString()
  let text = props.value.toISOString()
  if (props.time === false) {
    text = text.replace(TIME_PART_RE, '')
  }
  return (
    <span className='whitespace-no-wrap' title={datetimeText}>
      {text}
    </span>
  )
}

export default DatetimeText
