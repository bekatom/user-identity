/**
 * 403 (notActiveUser) Response
 *
 * Similar to 403 notActiveUser.
 * Specifically for use when authentication is possible but has failed or not yet been provided.
 * Error code response for user account is not active.
 */

module.exports = {
  status: 403,
  name: 'notActiveUser',
  code: 'E_NOT_ACTIVE',
  message: 'User account is not active',
  data: {}
};