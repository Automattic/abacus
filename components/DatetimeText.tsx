import React from 'react'

const TIME_PART_RE = /T\d{2}:\d{2}:\d{2}(?:\.\d+(?:Z)?)?/

/**
 * Renders the date value in ISO 8601 format UTC.
 */
const DatetimeText = ({ datetime, excludeTime }: { datetime: Date; excludeTime?: boolean }) => {
  const datetimeText = datetime.toLocaleString(process.env.LANG, { timeZone: process.env.TZ })
  let text = datetime.toISOString()
  if (excludeTime) {
    text = text.replace(TIME_PART_RE, '')
  }
  return (
    <span className='whitespace-no-wrap' title={datetimeText}>
      {text}
    </span>
  )
}

export default DatetimeText
