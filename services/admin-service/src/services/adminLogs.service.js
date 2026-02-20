const { AdminLog } = require('../models');
const { Op } = require('sequelize');

async function logAction(adminId, action, resource, resourceId, details, ip) {
  try {
    await AdminLog.create({
      admin_id: adminId,
      action,
      resource: resource || null,
      resource_id: resourceId || null,
      details: details || null,
      ip_address: ip || null,
    });
  } catch (err) {
    console.error('Admin log error:', err);
  }
}

async function getStats() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const count = await AdminLog.count({
    where: { created_at: { [Op.gte]: sevenDaysAgo } },
  });
  return { actionsLast7Days: count };
}

async function getLogs(limit = 100) {
  const rows = await AdminLog.findAll({
    order: [['created_at', 'DESC']],
    limit,
  });
  return rows.map((r) => r.get({ plain: true }));
}

module.exports = {
  logAction,
  getStats,
  getLogs,
};