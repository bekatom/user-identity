/**
 * 400 (Bad Request) Response
 *
 * The request cannot be fulfilled due to bad syntax.
 * General error when fulfilling the request would cause an invalid state.
 * Domain validation errors, missing data, etc.
 */

module.exports = {
  status: 400,
  name: 'badRequest',
  code: 'E_BAD_REQUEST',
  message: 'The request cannot be fulfilled due to bad syntax',
  data: {}
};
