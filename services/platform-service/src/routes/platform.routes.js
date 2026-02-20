const controller = require('../controllers/platform.controller');
const { internalAuth } = require('../middleware');

function register(router) {
  router.get('/platform/home', controller.getHome);
  router.get('/platform/states', controller.getStates);
  router.get('/platform/testimonials', controller.getTestimonials);
  router.get('/platform/footer', controller.getFooter);
  router.get('/platform/plans', controller.getPlans);
  router.get('/platform/plans/:slug', controller.getPlanBySlug);
  router.get('/platform/articles', controller.getArticles);
  router.get('/platform/articles/:slug', controller.getArticleBySlug);
  router.get('/platform/article-categories', controller.getArticleCategories);

  router.get('/internal/platform/home', internalAuth, controller.getHomeSectionsInternal);
  router.put('/internal/platform/home/:key', internalAuth, controller.upsertHomeSection);
  router.get('/internal/platform/states', internalAuth, controller.getStatesInternal);
  router.post('/internal/platform/states', internalAuth, controller.createState);
  router.put('/internal/platform/states/:id', internalAuth, controller.updateState);
  router.get('/internal/platform/testimonials', internalAuth, controller.getTestimonialsInternal);
  router.post('/internal/platform/testimonials', internalAuth, controller.createTestimonial);
  router.put('/internal/platform/testimonials/:id', internalAuth, controller.updateTestimonial);
  router.delete('/internal/platform/testimonials/:id', internalAuth, controller.deleteTestimonial);
  router.get('/internal/platform/footer', internalAuth, controller.getFooterInternal);
  router.put('/internal/platform/footer/:key', internalAuth, controller.upsertFooter);
  router.get('/internal/platform/plans', internalAuth, controller.getPlansInternal);
  router.get('/internal/platform/plans/:id', internalAuth, controller.getPlanByIdInternal);
  router.post('/internal/platform/plans', internalAuth, controller.createPlan);
  router.put('/internal/platform/plans/:id', internalAuth, controller.updatePlan);
  router.delete('/internal/platform/plans/:id', internalAuth, controller.deletePlan);
  router.get('/internal/platform/articles', internalAuth, controller.getArticlesInternal);
  router.get('/internal/platform/articles/:id', internalAuth, controller.getArticleByIdInternal);
  router.post('/internal/platform/articles', internalAuth, controller.createArticle);
  router.put('/internal/platform/articles/:id', internalAuth, controller.updateArticle);
  router.delete('/internal/platform/articles/:id', internalAuth, controller.deleteArticle);
  router.get('/internal/platform/article-categories', internalAuth, controller.getArticleCategoriesInternal);
  router.get('/internal/platform/tags', internalAuth, controller.getTagsInternal);
  router.get('/internal/platform/article-types', internalAuth, controller.getArticleTypesInternal);
  router.get('/internal/platform/courts', internalAuth, controller.getCourtsInternal);
}

module.exports = { register };
