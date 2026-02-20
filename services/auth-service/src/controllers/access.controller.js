const authService = require('../services/auth.service');
const accessService = require('../services/access.service');

async function check(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization', allowed: false });
  }
  const token = auth.slice(7);
  const courseId = req.query.courseId;
  if (!courseId) return res.status(400).json({ error: 'courseId required' });
  try {
    const result = await accessService.checkAccess(token, courseId);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token', allowed: false });
  }
}

async function grantCourse(req, res) {
  const { userId, courseId, orderId } = req.body;
  if (!userId || !courseId) {
    return res.status(400).json({ error: 'userId and courseId required' });
  }
  try {
    const result = await accessService.grantCourse({ userId, courseId, orderId });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Grant failed' });
  }
}

async function grantMembership(req, res) {
  const { userId, membershipType, orderId, startsAt, expiresAt } = req.body;
  if (!userId || !membershipType || !startsAt || !expiresAt) {
    return res.status(400).json({ error: 'userId, membershipType, startsAt, expiresAt required' });
  }
  try {
    const result = await accessService.grantMembership({ userId, membershipType, orderId, startsAt, expiresAt });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Grant failed' });
  }
}

module.exports = { check, grantCourse, grantMembership };
