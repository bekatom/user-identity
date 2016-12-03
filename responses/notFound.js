/**
 * 404 (Not Found) Response
 *
 * The requested resource could not be found but may be available again in the future.
 * Subsequent requests by the client are permissible.
 * Used when the requested resource is not found, whether it doesn't exist.
 */

module.exports = {
  status: 404,
  name: 'notFound',
  code: 'E_NOT_FOUND',
  message: 'The requested resource could not be found but may be available again in the future',
  data: {}
};