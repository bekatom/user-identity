/**
 * 500 (Internal Server Error) Response
 *
 * A generic error message, given when no more specific message is suitable.
 * The general catch-all error when the server-side throws an exception.
 */

module.exports = {
  status: 500,
  name: 'serverError',
  code: 'E_INTERNAL_SERVER_ERROR',
  message: 'Something bad happened on the server',
  data: {}
};