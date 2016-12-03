/**
 * 401 (Unauthorized) Response
 *
 * Similar to 401 unauthorized.
 * Specifically for use when authentication is possible but has failed or not yet been provided.
 * Error code response for missing or invalid authentication token.
 */

module.exports = {
  status: 401,
  name: 'unauthorized',
  code: 'E_UNAUTHORIZED',
  message: 'Missing or invalid authentication token',
  data: {}
};