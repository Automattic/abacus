import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles({
  root: {
    whiteSpace: 'nowrap',
  },
})

const ISO_DATE_LENGTH = 10

/**
 * Renders the date value in ISO 8601 format UTC.
 */
const DatetimeText = ({ datetime, excludeTime }: { datetime: Date; excludeTime?: boolean }) => {
  const classes = useStyles()
  // In order to force a consistent locale and timezone for the unit tests, we set
  // the following env vars. In the browser, we don't have these set and the function
  // behaves as if no parameters were passed to it. Note: Setting the env vars and
  // not explicitly setting them here works in non-Windows environments. We are only
  // being explicit here because of Windows.
  const localeString = datetime.toLocaleString(process.env.LANG, { timeZone: process.env.TZ })
  const isoString = datetime.toISOString()
  return (
    <span className={classes.root} title={localeString}>
      {excludeTime ? isoString.substring(0, ISO_DATE_LENGTH) : isoString}
    </span>
  )
}

export default DatetimeText
