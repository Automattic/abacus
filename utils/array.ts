/**
 * Determines whether the array has any duplicate strings.
 */
function hasDuplicateStrings(array: string[]) {
  const seen: { [key: string]: boolean } = {}

  for (let i = 0, iLen = array.length; i < iLen; ++i) {
    const str = array[i]
    if (str in seen) {
      return true
    }
    seen[str] = true
  }

  return false
}

export { hasDuplicateStrings }
