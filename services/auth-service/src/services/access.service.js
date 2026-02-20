const { UserCourse, UserMembership } = require('../models');
const authService = require('./auth.service');
const config = require('../config');

async function checkAccess(token, courseId) {
  const decoded = authService.verifyAccess(token);
  const row = await UserCourse.findOne({
    where: { user_id: decoded.userId, course_id: courseId },
  });
  return { allowed: !!row };
}

function isAuthorizedForGrant(req) {
  const key = req.headers['x-internal-api-key'];
  if (config.internalApiKey && key === config.internalApiKey) return true;
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return false;
  try {
    const decoded = authService.verifyAccess(auth.slice(7));
    return decoded.role === 'admin';
  } catch (_) {
    return false;
  }
}

async function grantCourse({ userId, courseId, orderId }) {
  const [row] = await UserCourse.findOrCreate({
    where: { user_id: userId, course_id: courseId },
    defaults: { order_id: orderId || null },
  });
  await row.update({ order_id: orderId || row.order_id });
  return { granted: true };
}

async function grantMembership({ userId, membershipType, orderId, startsAt, expiresAt }) {
  await UserMembership.create({
    user_id: userId,
    membership_type: membershipType,
    order_id: orderId || null,
    starts_at: startsAt,
    expires_at: expiresAt,
  });
  return { granted: true };
}

module.exports = {
  checkAccess,
  isAuthorizedForGrant,
  grantCourse,
  grantMembership,
};