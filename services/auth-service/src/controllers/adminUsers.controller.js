const adminUsersService = require('../services/adminUsers.service');
const { ALL_PERMISSIONS } = require('../config/permissions');

function sanitizePermissionOverrides(arr) {
  if (!Array.isArray(arr)) return [];
  const set = new Set(ALL_PERMISSIONS);
  return arr.filter((p) => typeof p === 'string' && set.has(p));
}

async function listRoles(req, res) {
  try {
    const roles = await adminUsersService.listRoles();
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list roles' });
  }
}

async function list(req, res) {
  try {
    const users = await adminUsersService.listAdminUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list admin users' });
  }
}

async function getOne(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  try {
    const user = await adminUsersService.getAdminUser(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get user' });
  }
}

async function create(req, res) {
  const { email, password, name, role_id, permission_overrides } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  if (role_id === undefined || role_id === null) {
    return res.status(400).json({ error: 'role_id required' });
  }
  try {
    const user = await adminUsersService.createAdminUser({
      email: String(email).trim(),
      password,
      name: name ? String(name).trim() : null,
      role_id: parseInt(role_id, 10),
      permission_overrides: sanitizePermissionOverrides(permission_overrides),
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.message && (err.message.includes('role') || err.message.includes('permission') || err.message.includes('admin:access'))) {
      return res.status(400).json({ error: err.message });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

async function update(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  const { name, role_id, is_active, password, permission_overrides } = req.body;
  try {
    const user = await adminUsersService.updateAdminUser(id, {
      name: name !== undefined ? (name ? String(name).trim() : null) : undefined,
      role_id: role_id !== undefined ? parseInt(role_id, 10) : undefined,
      is_active,
      password: password !== undefined ? password : undefined,
      permission_overrides: permission_overrides !== undefined ? sanitizePermissionOverrides(permission_overrides) : undefined,
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    if (err.message && err.message.includes('role')) {
      return res.status(400).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function remove(req, res) {
  const id = parseInt(req.params.id, 10);
  if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
  if (req.adminUser && req.adminUser.id === id) {
    return res.status(400).json({ error: 'You cannot delete your own account' });
  }
  try {
    const deleted = await adminUsersService.deleteAdminUser(id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = { listRoles, list, getOne, create, update, remove };
