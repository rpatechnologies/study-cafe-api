function getUserId(req) {
  const xUserId = req.headers['x-user-id'];
  if (xUserId) return parseInt(xUserId, 10) || xUserId;
  const user = req.user;
  if (user && user.userId) return user.userId;
  if (user && typeof user.id !== 'undefined') return user.id;
  return null;
}

function requireUserId(req, res, next) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  req.userId = userId;
  next();
}

module.exports = { getUserId, requireUserId };
