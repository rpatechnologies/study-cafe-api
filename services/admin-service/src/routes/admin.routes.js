const controller = require('../controllers/admin.controller');
const { requireAdmin, internalAuth } = require('../middleware');

function register(router) {
  router.get('/admin/me', requireAdmin, controller.me);
  router.get('/internal/payment-config', internalAuth, controller.getPaymentConfigInternal);
  router.get('/admin/stats', requireAdmin, controller.getStats);
  router.put('/admin/payment-config', requireAdmin, controller.updatePaymentConfig);
  router.get('/admin/logs', requireAdmin, controller.getLogs);

  router.get('/admin/courses', requireAdmin, controller.getCourses);
  router.get('/admin/course-cats', requireAdmin, controller.getCourseCats);
  router.post('/admin/courses', requireAdmin, controller.createCourse);
  router.put('/admin/courses/:id', requireAdmin, controller.updateCourse);
  router.post('/admin/courses/:id/batches', requireAdmin, controller.createBatch);
  router.put('/admin/batches/:id', requireAdmin, controller.updateBatch);
  router.post('/admin/batches/:id/sessions', requireAdmin, controller.createSession);
  router.put('/admin/sessions/:id', requireAdmin, controller.updateSession);
  router.post('/admin/sessions/:id/recordings', requireAdmin, controller.addRecording);
  router.post('/admin/courses/:id/materials', requireAdmin, controller.addMaterial);

  const p = controller.platform;
  router.get('/admin/platform/home', requireAdmin, p.getHome);
  router.put('/admin/platform/home/:key', requireAdmin, p.putHome);
  router.get('/admin/platform/states', requireAdmin, p.getStates);
  router.post('/admin/platform/states', requireAdmin, p.postState);
  router.put('/admin/platform/states/:id', requireAdmin, p.putState);
  router.get('/admin/platform/testimonials', requireAdmin, p.getTestimonials);
  router.post('/admin/platform/testimonials', requireAdmin, p.postTestimonial);
  router.put('/admin/platform/testimonials/:id', requireAdmin, p.putTestimonial);
  router.delete('/admin/platform/testimonials/:id', requireAdmin, p.deleteTestimonial);
  router.get('/admin/platform/footer', requireAdmin, p.getFooter);
  router.put('/admin/platform/footer/:key', requireAdmin, p.putFooter);
  router.get('/admin/platform/plans', requireAdmin, p.getPlans);
  router.get('/admin/platform/plans/:id', requireAdmin, p.getPlan);
  router.post('/admin/platform/plans', requireAdmin, p.postPlan);
  router.put('/admin/platform/plans/:id', requireAdmin, p.putPlan);
  router.delete('/admin/platform/plans/:id', requireAdmin, p.deletePlan);
  router.get('/admin/platform/articles', requireAdmin, p.getArticles);
  router.get('/admin/platform/articles/:id', requireAdmin, p.getArticle);
  router.post('/admin/platform/articles', requireAdmin, p.postArticle);
  router.put('/admin/platform/articles/:id', requireAdmin, p.putArticle);
  router.delete('/admin/platform/articles/:id', requireAdmin, p.deleteArticle);
  router.get('/admin/platform/article-categories', requireAdmin, p.getArticleCategories);
  router.get('/admin/platform/tags', requireAdmin, p.getTags);
  router.get('/admin/platform/article-types', requireAdmin, p.getArticleTypes);
  router.get('/admin/platform/courts', requireAdmin, p.getCourts);
}

module.exports = { register };
