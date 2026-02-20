const platformService = require('../services/platform.service');

async function getHome(req, res) {
  try {
    const data = await platformService.home.getHomePublic();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch home data' });
  }
}

async function getHomeSectionsInternal(req, res) {
  try {
    const data = await platformService.home.getHomeSectionsInternal();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch home sections' });
  }
}

async function upsertHomeSection(req, res) {
  try {
    const data = await platformService.home.upsertHomeSection(req.params.key, req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update home section' });
  }
}

async function getStates(req, res) {
  try {
    const data = await platformService.states.getStatesPublic();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
}

async function getStatesInternal(req, res) {
  try {
    const data = await platformService.states.getStatesInternal();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch states' });
  }
}

async function createState(req, res) {
  try {
    const data = await platformService.states.createState(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create state' });
  }
}

async function updateState(req, res) {
  try {
    const data = await platformService.states.updateState(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'State not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update state' });
  }
}

async function getTestimonials(req, res) {
  try {
    const featured = req.query.featured === '1' || req.query.featured === 'true';
    const data = await platformService.testimonials.getTestimonialsPublic(featured);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
}

async function getTestimonialsInternal(req, res) {
  try {
    const data = await platformService.testimonials.getTestimonialsInternal();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
}

async function createTestimonial(req, res) {
  try {
    const data = await platformService.testimonials.createTestimonial(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
}

async function updateTestimonial(req, res) {
  try {
    const data = await platformService.testimonials.updateTestimonial(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
}

async function deleteTestimonial(req, res) {
  try {
    const ok = await platformService.testimonials.deleteTestimonial(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Testimonial not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
}

async function getFooter(req, res) {
  try {
    const data = await platformService.footer.getFooterPublic();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch footer data' });
  }
}

async function getFooterInternal(req, res) {
  try {
    const data = await platformService.footer.getFooterInternal();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch footer data' });
  }
}

async function upsertFooter(req, res) {
  try {
    const data = await platformService.footer.upsertFooter(req.params.key, req.body);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update footer' });
  }
}

async function getPlans(req, res) {
  try {
    const data = await platformService.plans.getPlansPublic();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
}

async function getPlanBySlug(req, res) {
  try {
    const data = await platformService.plans.getPlanBySlugPublic(req.params.slug);
    if (!data) return res.status(404).json({ error: 'Plan not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
}

async function getPlansInternal(req, res) {
  try {
    const data = await platformService.plans.getPlansInternal();
    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
}

async function getPlanByIdInternal(req, res) {
  try {
    const data = await platformService.plans.getPlanByIdInternal(req.params.id);
    if (!data) return res.status(404).json({ error: 'Plan not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
}

async function createPlan(req, res) {
  try {
    const data = await platformService.plans.createPlan(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create plan' });
  }
}

async function updatePlan(req, res) {
  try {
    const data = await platformService.plans.updatePlan(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Plan not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update plan' });
  }
}

async function deletePlan(req, res) {
  try {
    const ok = await platformService.plans.deletePlan(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Plan not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
}

async function getArticles(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
    const offset = parseInt(req.query.offset || '0', 10);
    const data = await platformService.articles.getArticlesPublic(limit, offset);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}

async function getArticleBySlug(req, res) {
  try {
    const data = await platformService.articles.getArticleBySlugPublic(req.params.slug);
    if (!data) return res.status(404).json({ error: 'Article not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
}

async function getArticlesInternal(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const search = req.query.search ? String(req.query.search).trim() : undefined;
    const sortBy = req.query.sortBy ? String(req.query.sortBy).trim() : undefined;
    const sortOrder = (req.query.sortOrder && /^(ASC|DESC)$/i.test(req.query.sortOrder))
      ? req.query.sortOrder.toUpperCase()
      : 'DESC';

    const result = await platformService.articles.getArticlesInternal({
      status: req.query.status,
      page,
      limit,
      search: search || undefined,
      sortBy,
      sortOrder,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
}

async function getArticleByIdInternal(req, res) {
  try {
    const data = await platformService.articles.getArticleByIdInternal(req.params.id);
    if (!data) return res.status(404).json({ error: 'Article not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
}

async function createArticle(req, res) {
  try {
    const data = await platformService.articles.createArticle(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create article' });
  }
}

async function updateArticle(req, res) {
  try {
    const data = await platformService.articles.updateArticle(req.params.id, req.body);
    if (!data) return res.status(404).json({ error: 'Article not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update article' });
  }
}

async function deleteArticle(req, res) {
  try {
    const ok = await platformService.articles.deleteArticle(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Article not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete article' });
  }
}

async function getArticleCategories(req, res) {
  try {
    const data = await platformService.articleCategories.getArticleCategories();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

async function getArticleCategoriesInternal(req, res) {
  try {
    const data = await platformService.articleCategories.getArticleCategories();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

async function getTagsInternal(req, res) {
  try {
    const data = await platformService.tags.getTagsInternal();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
}

async function getArticleTypesInternal(req, res) {
  try {
    const data = await platformService.articleTypes.getArticleTypesInternal();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch article types' });
  }
}

async function getCourtsInternal(req, res) {
  try {
    const data = await platformService.courts.getCourtsInternal();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courts' });
  }
}

module.exports = {
  getHome,
  getHomeSectionsInternal,
  upsertHomeSection,
  getStates,
  getStatesInternal,
  createState,
  updateState,
  getTestimonials,
  getTestimonialsInternal,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getFooter,
  getFooterInternal,
  upsertFooter,
  getPlans,
  getPlanBySlug,
  getPlansInternal,
  getPlanByIdInternal,
  createPlan,
  updatePlan,
  deletePlan,
  getArticles,
  getArticleBySlug,
  getArticlesInternal,
  getArticleByIdInternal,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleCategories,
  getArticleCategoriesInternal,
  getTagsInternal,
  getArticleTypesInternal,
  getCourtsInternal,
};
