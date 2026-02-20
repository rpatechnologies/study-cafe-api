const adminUsersController = require('../controllers/adminUsers.controller');
const { requireAdmin, requirePermission } = require('../middleware/requireAdmin');

function register(router) {
  router.get('/auth/admin/roles', requireAdmin, requirePermission('admin_users:list', 'admin_users:view', 'admin_users:create', 'admin_users:edit'), adminUsersController.listRoles);
  router.get('/auth/admin/users', requireAdmin, requirePermission('admin_users:list'), adminUsersController.list);
  router.get('/auth/admin/users/:id', requireAdmin, requirePermission('admin_users:view', 'admin_users:edit'), adminUsersController.getOne);
  router.post('/auth/admin/users', requireAdmin, requirePermission('admin_users:create'), adminUsersController.create);
  router.patch('/auth/admin/users/:id', requireAdmin, requirePermission('admin_users:edit'), adminUsersController.update);
  router.delete('/auth/admin/users/:id', requireAdmin, requirePermission('admin_users:delete'), adminUsersController.remove);
}

module.exports = { register };
