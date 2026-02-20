const { errorHandler } = require('./errorHandler');
const { requireAdmin, getAdminId, getAdminRole } = require('./requireAdmin');
const { internalAuth } = require('./internalAuth');

module.exports = {
  errorHandler,
  requireAdmin,
  getAdminId,
  getAdminRole,
  internalAuth,
};
