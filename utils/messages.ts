/**
 * Creates an is-required message.
 *
 * @param {Object} data
 * @param {Object} [data.label] - An optional label to explicitly state what is
 *   required.
 */
const isRequired = (data: { [key: string]: unknown } = {}) => {
  return data.label ? `${data.label} is required.` : 'Required.'
}

/**
 * Creates a length-must-be-less-than message.
 *
 * @param {Object} data
 * @param {number} data.maxLength - The maximum allowed length.
 * @param {Object} [data.label] - An optional label to explicitly state what must
 *   have a length less than max-length.
 */
const lengthMustBeLessThan = (data: { [key: string]: unknown }) => {
  return data.label
    ? `Length of ${data.label} must be less than ${data.maxLength}.`
    : `Length must be less than ${data.maxLength}.`
}

/**
 * Creates a must-be-greater-than message.
 *
 * @param {Object} data
 * @param {number} data.min - The minimum allowed value.
 * @param {Object} [data.label] - An optional label to explicitly state what must be
 *   greater than or equal to minimum value.
 */
const mustBeGreaterThanOrEqual = (data: { [key: string]: unknown }) => {
  return data.label
    ? `${data.label} must be greater than or equal to ${data.min}.`
    : `Must be greater than or equal to ${data.min}.`
}

/**
 * Creates a must-be-less-than message.
 *
 * @param {Object} data
 * @param {number} data.max - The maximum allowed value.
 * @param {Object} [data.label] - An optional label to explicitly state what must be
 *   less than or equal to maximum value.
 */
const mustBeLessThanOrEqual = (data: { [key: string]: unknown }) => {
  return data.label
    ? `${data.label} must be less than or equal to ${data.max}.`
    : `Must be less than or equal to ${data.max}.`
}

/**
 * Creates a must-match-pattern message.
 *
 * @param {Object} data
 * @param {number} data.pattern - The pattern that must match.
 * @param {Object} [data.label] - An optional label to explicitly state what must
 *   match the pattern.
 */
const mustMatchPattern = (data: { [key: string]: unknown }) => {
  return data.label ? `${data.label} must match ${data.pattern}.` : `Must match ${data.pattern}.`
}

export { isRequired, lengthMustBeLessThan, mustBeGreaterThanOrEqual, mustBeLessThanOrEqual, mustMatchPattern }
