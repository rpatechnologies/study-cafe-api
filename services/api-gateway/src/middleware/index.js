const { rateLimit } = require('./rateLimit');
const { validateJWT, optionalJWT, requireCourseAccess } = require('./auth');
const { errorHandler } = require('./errorHandler');

module.exports = {
  rateLimit,
  validateJWT,
  optionalJWT,
  requireCourseAccess,
  errorHandler,
};
