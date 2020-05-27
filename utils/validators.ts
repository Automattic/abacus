import { typeOf } from 'qc-type_of'

/**
 * Composes the validators in such a manner that the first one to return an error
 * message "wins".
 *
 * @param {...function} validators
 */
const composeValidators = (...validators: ((value: unknown) => string | undefined)[]) => (value: unknown) =>
  validators.reduce((error: string | undefined, validator) => error || validator(value), undefined)

/**
 * Creates a max validator.
 *
 * @param {Function} msg - The message generating function to be called if the
 *   max validation does not validate.
 * @param {Object} data - Max configuration plus any extraneous data to be passed to
 *   the message generating function.
 * @param {number} data.max - The maximum allowed value.
 */
const createMax = (
  msg: (data: { [key: string]: unknown }) => string,
  data: { [key: string]: unknown; max: number },
) => {
  return (value: unknown): string | undefined => {
    if (typeOf(value) === 'number' && (value as number) > data.max) {
      return msg(data)
    }
  }
}

/**
 * Creates a max-length validator.
 *
 * @param {Function} msg - The message generating function to be called if the
 *   max-length validation does not validate.
 * @param {Object} data - Max-length configuration plus any extraneous data to be
 *   passed to the message generating function.
 * @param {number} data.maxLength - The maximum allowed length.
 */
const createMaxLength = (
  msg: (data: { [key: string]: unknown }) => string,
  data: { [key: string]: unknown; maxLength: number },
) => {
  return (value: unknown): string | undefined => {
    if (typeOf(value) === 'string' && (value as string).length > data.maxLength) {
      return msg(data)
    }
  }
}

/**
 * Creates a min validator.
 *
 * @param {Function} msg - The message generating function to be called if the
 *   min validation does not validate.
 * @param {Object} data - Min configuration plus any extraneous data to be passed to
 *   the message generating function.
 * @param {number} data.min - The minimum allowed value.
 */
const createMin = (
  msg: (data: { [key: string]: unknown }) => string,
  data: { [key: string]: unknown; min: number },
) => {
  return (value: unknown): string | undefined => {
    if (typeOf(value) === 'number' && (value as number) < data.min) {
      return msg(data)
    }
  }
}

/**
 * Creates a required validator.
 *
 * @param {Function} msg - The message generating function to be called if the
 *   required validation does not validate.
 * @param {Object} data - Any extraneous data to be passed to the message generating
 *   function.
 */
const createRequired = (msg: (data: { [key: string]: unknown }) => string, data: { [key: string]: unknown } = {}) => {
  return (value: unknown): string | undefined => {
    if (!(value || value === 0)) {
      return msg(data)
    }
  }
}

/**
 * Creates a pattern validator.
 *
 * @param {Function} msg - The message generating function to be called if the
 *   pattern validation does not validate.
 * @param {Object} data - Pattern configuration plus any extraneous data to be
 *   passed to the message generating function.
 * @param {number} data.pattern - The pattern to match.
 */
const createPattern = (
  msg: (data: { [key: string]: unknown }) => string,
  data: { [key: string]: unknown; pattern: string },
) => {
  const patternRegExp = new RegExp(data.pattern)
  return (value: unknown): string | undefined => {
    if (!(typeof value === 'string' && patternRegExp.test(value))) {
      return msg(data)
    }
  }
}

export { composeValidators, createMax, createMaxLength, createMin, createPattern, createRequired }
