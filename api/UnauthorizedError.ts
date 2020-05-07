/**
 * An error that is thrown when the user is determined to be unauthorized.
 */
class UnauthorizedError extends Error {
  constructor() {
    super()

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnauthorizedError)
    }

    this.name = 'UnauthorizedError'
  }
}

export default UnauthorizedError
