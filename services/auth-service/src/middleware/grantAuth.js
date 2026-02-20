const accessService = require('../services/access.service');

function requireGrantAuth(req, res, next) {
  if (accessService.isAuthorizedForGrant(req)) return next();
  res.status(401).json({ error: 'Missing or invalid authorization' });
}

module.exports = { requireGrantAuth };
