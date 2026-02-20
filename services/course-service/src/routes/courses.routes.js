const coursesController = require('../controllers/courses.controller');
const { internalAuth } = require('../middleware');

function register(router) {
  router.get('/courses', coursesController.list);
  router.get('/courses/:id', coursesController.getById);
  router.get('/courses/:id/sessions', coursesController.getSessions);
  router.get('/courses/:id/materials', coursesController.getMaterials);

  router.get('/internal/courses', internalAuth, coursesController.listAllInternal);
  router.get('/internal/course-cats', internalAuth, coursesController.listCourseCatsInternal);
  router.post('/internal/courses', internalAuth, coursesController.createCourse);
  router.put('/internal/courses/:id', internalAuth, coursesController.updateCourse);
  router.post('/internal/courses/:id/batches', internalAuth, coursesController.createBatch);
  router.put('/internal/batches/:id', internalAuth, coursesController.updateBatch);
  router.post('/internal/batches/:id/sessions', internalAuth, coursesController.createSession);
  router.put('/internal/sessions/:id', internalAuth, coursesController.updateSession);
  router.post('/internal/sessions/:id/recordings', internalAuth, coursesController.addRecording);
  router.post('/internal/courses/:id/materials', internalAuth, coursesController.addMaterial);
}

module.exports = { register };
