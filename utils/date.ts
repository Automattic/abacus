import format from 'date-fns/format'

/**
 * Formats the date in ISO-8601 format with a UTC timezone value plus a `+00:00`
 * offset.
 */
function formatIsoUtcOffset(date: Date) {
  return format(new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss.SSS'+00:00'")
}

export { formatIsoUtcOffset }
