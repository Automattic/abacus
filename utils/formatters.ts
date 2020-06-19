import format from 'date-fns/format'

const usCurrencyDollarFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/**
 * Formats the date in ISO-8601 format with a UTC timezone value plus a `+00:00`
 * offset. This is in the same format as we receive from the API.
 */
function formatIsoUtcOffset(date: Date) {
  return format(new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000), "yyyy-MM-dd'T'HH:mm:ss.SSS'+00:00'")
}

/**
 * Formats the number as US dollar.
 */
function formatUsCurrencyDollar(value: number) {
  return usCurrencyDollarFormatter.format(value)
}

export { formatIsoUtcOffset, formatUsCurrencyDollar }
