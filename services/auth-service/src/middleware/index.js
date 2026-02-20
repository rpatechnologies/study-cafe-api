const { errorHandler } = require('./errorHandler');
const { requireGrantAuth } = require('./grantAuth');

module.exports = {
  errorHandler,
  requireGrantAuth,
};
