const controller = require('../controllers/platform.controller');
const { internalAuth } = require('../middleware');
const { uploadImage: uploadImageMw } = require('../middleware/upload');
const schemas = require('../validations/schemas');
const { validate } = require('../../../../shared');

function register(router) {
  // ── Public routes ────────────────────────────────────────────────
  router.get('/platform/home', controller.getHome);
  router.get('/platform/states', controller.getStates);
  router.get('/platform/testimonials', controller.getTestimonials);
  router.get('/platform/footer', controller.getFooter);
  router.get('/platform/plans', controller.getPlans);
  router.get('/platform/plans/:slug', validate(schemas.slugParam), controller.getPlanBySlug);
  router.get('/platform/articles', controller.getArticles);
  router.get('/platform/articles/:slug', validate(schemas.slugParam), controller.getArticleBySlug);
  router.get('/platform/article-categories', controller.getArticleCategories);
  router.get('/platform/cms-pages/:slug', validate(schemas.slugParam), controller.getCmsPageBySlug);

  // ── Internal routes (admin proxy) ────────────────────────────────
  router.get('/internal/platform/home', internalAuth, controller.getHomeSectionsInternal);
  router.put('/internal/platform/home/:key', internalAuth, validate(schemas.upsertHomeSection), controller.upsertHomeSection);
  router.get('/internal/platform/states', internalAuth, controller.getStatesInternal);
  router.post('/internal/platform/states', internalAuth, validate(schemas.createState), controller.createState);
  router.put('/internal/platform/states/:id', internalAuth, validate(schemas.updateState), controller.updateState);
  router.get('/internal/platform/testimonials', internalAuth, controller.getTestimonialsInternal);
  router.post('/internal/platform/testimonials', internalAuth, validate(schemas.createTestimonial), controller.createTestimonial);
  router.put('/internal/platform/testimonials/:id', internalAuth, validate(schemas.updateTestimonial), controller.updateTestimonial);
  router.delete('/internal/platform/testimonials/:id', internalAuth, validate(schemas.idParam), controller.deleteTestimonial);
  router.get('/internal/platform/footer', internalAuth, controller.getFooterInternal);
  router.put('/internal/platform/footer/:key', internalAuth, validate(schemas.upsertFooter), controller.upsertFooter);
  router.get('/internal/platform/plans', internalAuth, controller.getPlansInternal);
  router.get('/internal/platform/plans/:id', internalAuth, validate(schemas.idParam), controller.getPlanByIdInternal);
  router.post('/internal/platform/plans', internalAuth, validate(schemas.createPlan), controller.createPlan);
  router.put('/internal/platform/plans/:id', internalAuth, validate(schemas.updatePlan), controller.updatePlan);
  router.delete('/internal/platform/plans/:id', internalAuth, validate(schemas.idParam), controller.deletePlan);
  router.get('/internal/platform/articles', internalAuth, validate(schemas.articleListQuery), controller.getArticlesInternal);
  router.get('/internal/platform/articles/:id', internalAuth, validate(schemas.idParam), controller.getArticleByIdInternal);
  router.post('/internal/platform/articles', internalAuth, validate(schemas.createArticle), controller.createArticle);
  router.put('/internal/platform/articles/:id', internalAuth, validate(schemas.updateArticle), controller.updateArticle);
  router.delete('/internal/platform/articles/:id', internalAuth, validate(schemas.idParam), controller.deleteArticle);
  router.get('/internal/platform/article-categories', internalAuth, controller.getArticleCategoriesInternal);
  router.get('/internal/platform/tags', internalAuth, controller.getTagsInternal);
  router.get('/internal/platform/article-types', internalAuth, controller.getArticleTypesInternal);
  router.get('/internal/platform/courts', internalAuth, controller.getCourtsInternal);
  router.get('/internal/platform/cms-pages', internalAuth, controller.getCmsPagesInternal);
  router.get('/internal/platform/cms-pages/:slug', internalAuth, validate(schemas.slugParam), controller.getCmsPageBySlugInternal);
  router.put('/internal/platform/cms-pages/:slug', internalAuth, validate(schemas.upsertCmsPage), controller.putCmsPageBySlug);
  router.post('/internal/platform/upload/image', internalAuth, uploadImageMw, controller.uploadImage);
}

module.exports = { register };
