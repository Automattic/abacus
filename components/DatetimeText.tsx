import React from 'react'

const ISO_DATE_LENGTH = 10

/**
 * Renders the date value in ISO 8601 format UTC.
 */
const DatetimeText = ({ datetime, excludeTime }: { datetime: Date; excludeTime?: boolean }) => {
  const datetimeText = datetime.toLocaleString(process.env.LANG, { timeZone: process.env.TZ })
  let text = datetime.toISOString()
  if (excludeTime) {
    text = text.substring(0, ISO_DATE_LENGTH)
  }
  return (
    <span className='datetime-text' title={datetimeText}>
      {text}
    </span>
  )
}

export default DatetimeText
