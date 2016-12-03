/**
 * 401 (tokenExpired) Response
 *
 * Similar to 403 Forbidden.
 * Specifically for use when authentication is possible but has failed or not yet been provided.
 * Error code response for Token expired.
 */

module.exports = {
  status: 401,
  name: 'tokenExpired',
  code: 'EXPIRED_TOKEN',
  message: 'Token has been expired',
  data: {}
};