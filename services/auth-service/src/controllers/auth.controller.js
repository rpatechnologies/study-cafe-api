const authService = require('../services/auth.service');

async function register(req, res) {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const user = await authService.register({ email, password, name });
    const accessToken = authService.signAccess({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = authService.signRefresh({ userId: user.id });
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
      expiresIn: 3600,
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email already registered' });
    }
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  try {
    const result = await authService.login({ email, password });
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
}

async function validate(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization' });
  }
  const token = auth.slice(7);
  try {
    const user = await authService.validateToken(token);
    if (!user) return res.status(401).json({ error: 'User not found or inactive' });
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function me(req, res) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization' });
  }
  const token = auth.slice(7);
  try {
    const user = await authService.validateToken(token);
    if (!user) return res.status(401).json({ error: 'User not found or inactive' });
    res.json({
      id: user.id || String(user.userId),
      email: user.email,
      name: user.name || '',
      role: user.role,
      permissions: user.permissions || [],
    });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token required' });
  try {
    const result = await authService.refreshTokens(refreshToken);
    if (!result) return res.status(401).json({ error: 'User not found' });
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
}

module.exports = { register, login, validate, me, refresh };
