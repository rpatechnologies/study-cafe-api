const { errorHandler } = require('./errorHandler');
const { getUserId, requireUserId } = require('./userId');
const { internalAuth } = require('./internalAuth');

module.exports = {
  errorHandler,
  getUserId,
  requireUserId,
  internalAuth,
};
