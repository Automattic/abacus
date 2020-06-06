const usCurrencyDollarFormatter = new Intl.NumberFormat('us', { style: 'currency', currency: 'USD' })

/**
 * Formats the number as US dollar.
 */
function formatUsCurrencyDollar(value: number) {
  return usCurrencyDollarFormatter.format(value)
}

export { formatUsCurrencyDollar }
