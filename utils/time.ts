/**
 * Formats date as ISO8601 date in UTC timezone.
 * (date-fns can't do this directly...)
 */
export function formatIsoDate(date: Date) {
  // ISOString: 2015-02-20T13:59:31.238Z
  //            012345678901234567890123
  //            |<------>|
  return date.toISOString().substr(0, 10)
}
