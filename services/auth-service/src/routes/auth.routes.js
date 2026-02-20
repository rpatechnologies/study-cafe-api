const authController = require('../controllers/auth.controller');

function register(router) {
  router.post('/auth/register', authController.register);
  router.post('/auth/login', authController.login);
  router.get('/auth/validate', authController.validate);
  router.get('/auth/me', authController.me);
  router.post('/auth/refresh', authController.refresh);
}

module.exports = { register };
