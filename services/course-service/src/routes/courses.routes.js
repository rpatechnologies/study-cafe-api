const coursesController = require('../controllers/courses.controller');
const { internalAuth } = require('../middleware');
const schemas = require('../validations/schemas');
const { validate } = require('../../../../shared');

function register(router) {
  // Public routes
  router.get('/courses', coursesController.list);
  router.get('/courses/:id', validate(schemas.idParam), coursesController.getById);
  router.get('/courses/:id/sessions', validate(schemas.idParam), coursesController.getSessions);
  router.get('/courses/:id/materials', validate(schemas.idParam), coursesController.getMaterials);

  // Internal routes (admin proxy)
  router.get('/internal/courses', internalAuth, coursesController.listAllInternal);
  router.get('/internal/courses/:id', internalAuth, validate(schemas.idParam), coursesController.getByIdInternal);
  router.get('/internal/courses/:id/sessions', internalAuth, validate(schemas.idParam), coursesController.getSessionsInternal);
  router.get('/internal/course-cats', internalAuth, coursesController.listCourseCatsInternal);
  router.post('/internal/courses', internalAuth, validate(schemas.createCourse), coursesController.createCourse);
  router.put('/internal/courses/:id', internalAuth, validate(schemas.updateCourse), coursesController.updateCourse);
  router.post('/internal/courses/:id/batches', internalAuth, validate(schemas.createBatch), coursesController.createBatch);
  router.put('/internal/batches/:id', internalAuth, validate(schemas.updateBatch), coursesController.updateBatch);
  router.post('/internal/batches/:id/sessions', internalAuth, validate(schemas.createSession), coursesController.createSession);
  router.put('/internal/sessions/:id', internalAuth, validate(schemas.updateSession), coursesController.updateSession);
  router.post('/internal/sessions/:id/recordings', internalAuth, validate(schemas.addRecording), coursesController.addRecording);
  router.put('/internal/recordings/:id', internalAuth, validate(schemas.updateRecording), coursesController.updateRecording);
  router.post('/internal/courses/:id/materials', internalAuth, validate(schemas.addMaterial), coursesController.addMaterial);

  // Course Page Settings
  router.get('/internal/course-page-settings', internalAuth, coursesController.getPageSettings);
  router.put('/internal/course-page-settings/:key', internalAuth, validate(schemas.updatePageSetting), coursesController.updatePageSetting);
}

module.exports = { register };
