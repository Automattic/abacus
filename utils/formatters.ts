const usCurrencyDollarFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/**
 * Formats the boolean as Yes or No.
 */
function formatBoolean(bool: boolean) {
  return bool ? 'Yes' : 'No'
}

/**
 * Formats the number as US dollar.
 */
function formatUsCurrencyDollar(value: number) {
  return usCurrencyDollarFormatter.format(value)
}

export { formatBoolean, formatUsCurrencyDollar }
