const accessController = require('../controllers/access.controller');
const { requireGrantAuth } = require('../middleware');

function register(router) {
  router.get('/access/check', accessController.check);
  router.post('/access/grant-course', requireGrantAuth, accessController.grantCourse);
  router.post('/access/grant-membership', requireGrantAuth, accessController.grantMembership);
}

module.exports = { register };
