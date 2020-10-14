/**
 * An error that is thrown when the API call does not find the resource requested.
 */
// istanbul ignore next
class NotFoundError extends Error {
  constructor() {
    super()

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError)
    }

    this.name = 'NotFoundError'
  }
}

export default NotFoundError
