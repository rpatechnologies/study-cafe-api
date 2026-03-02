const accessController = require('../controllers/access.controller');
const { requireGrantAuth } = require('../middleware');
const schemas = require('../validations/schemas');
const { validate } = require('../../../../shared');

function register(router) {
  router.get('/access/check', validate(schemas.checkAccess), accessController.check);
  router.post('/access/grant-course', requireGrantAuth, validate(schemas.grantCourse), accessController.grantCourse);
  router.post('/access/grant-membership', requireGrantAuth, validate(schemas.grantMembership), accessController.grantMembership);
}

module.exports = { register };
