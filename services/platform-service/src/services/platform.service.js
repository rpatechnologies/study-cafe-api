const { Op } = require('sequelize');
const { paginate } = require('../../../../shared');
const {
  HomeSection,
  State,
  Testimonial,
  FooterData,
  PremiumPlan,
  PlanCourse,
  PlanCourseCategory,
  Article,
  ArticleCategoryMap,
  ArticleTagMap,
  ArticleTypeMap,
  ArticleCourtMap,
  Category,
  Tag,
  ArticleType,
  Court,
} = require('../models');

function toPlain(row) {
  return row ? row.get({ plain: true }) : null;
}

async function getHomePublic() {
  const rows = await HomeSection.findAll({
    where: { is_active: true },
    order: [['sort_order', 'ASC']],
    attributes: ['section_key', 'title', 'content', 'meta'],
  });
  return rows.reduce((acc, r) => {
    const p = r.get({ plain: true });
    acc[p.section_key] = { title: p.title, content: p.content, meta: p.meta || null };
    return acc;
  }, {});
}

async function getHomeSectionsInternal() {
  const rows = await HomeSection.findAll({
    order: [['sort_order', 'ASC']],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function upsertHomeSection(key, data) {
  const { title, content, meta, sort_order, is_active } = data;
  const [row, created] = await HomeSection.findOrCreate({
    where: { section_key: key },
    defaults: {
      title: title ?? '',
      content: content ?? null,
      meta: meta || null,
      sort_order: sort_order ?? 0,
      is_active: is_active !== undefined ? !!is_active : true,
    },
  });
  if (!created) {
    await row.update({
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content }),
      ...(meta !== undefined && { meta }),
      ...(sort_order !== undefined && { sort_order }),
      ...(is_active !== undefined && { is_active: !!is_active }),
    });
  }
  return row.get({ plain: true });
}

async function getStatesPublic() {
  const rows = await State.findAll({
    where: { is_active: true },
    order: [
      ['sort_order', 'ASC'],
      ['name', 'ASC'],
    ],
    attributes: ['id', 'name', 'code', 'country_code'],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function getStatesInternal() {
  const rows = await State.findAll({
    order: [
      ['sort_order', 'ASC'],
      ['name', 'ASC'],
    ],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function createState(data) {
  const { name, code, country_code, sort_order, is_active } = data;
  const row = await State.create({
    name: name || '',
    code: code || null,
    country_code: country_code || 'IN',
    sort_order: sort_order ?? 0,
    is_active: is_active !== undefined ? !!is_active : true,
  });
  return row.get({ plain: true });
}

async function updateState(id, data) {
  const row = await State.findByPk(id);
  if (!row) return null;
  const { name, code, country_code, sort_order, is_active } = data;
  await row.update({
    ...(name !== undefined && { name }),
    ...(code !== undefined && { code }),
    ...(country_code !== undefined && { country_code }),
    ...(sort_order !== undefined && { sort_order }),
    ...(is_active !== undefined && { is_active: !!is_active }),
  });
  return row.get({ plain: true });
}

async function getTestimonialsPublic(featuredOnly) {
  const where = { is_active: true };
  if (featuredOnly) where.is_featured = true;
  const rows = await Testimonial.findAll({
    where,
    order: [
      ['sort_order', 'ASC'],
      ['id', 'DESC'],
    ],
    attributes: ['id', 'author_name', 'author_role', 'content', 'avatar_url', 'rating', 'sort_order'],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function getTestimonialsInternal() {
  const rows = await Testimonial.findAll({
    order: [
      ['sort_order', 'ASC'],
      ['id', 'DESC'],
    ],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function createTestimonial(data) {
  const row = await Testimonial.create({
    author_name: data.author_name || '',
    author_role: data.author_role || null,
    content: data.content || '',
    avatar_url: data.avatar_url || null,
    rating: data.rating ?? null,
    is_featured: !!data.is_featured,
    sort_order: data.sort_order ?? 0,
    is_active: data.is_active !== undefined ? !!data.is_active : true,
  });
  return row.get({ plain: true });
}

async function updateTestimonial(id, data) {
  const row = await Testimonial.findByPk(id);
  if (!row) return null;
  await row.update({
    ...(data.author_name !== undefined && { author_name: data.author_name }),
    ...(data.author_role !== undefined && { author_role: data.author_role }),
    ...(data.content !== undefined && { content: data.content }),
    ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
    ...(data.rating !== undefined && { rating: data.rating }),
    ...(data.is_featured !== undefined && { is_featured: !!data.is_featured }),
    ...(data.sort_order !== undefined && { sort_order: data.sort_order }),
    ...(data.is_active !== undefined && { is_active: !!data.is_active }),
  });
  return row.get({ plain: true });
}

async function deleteTestimonial(id) {
  const deleted = await Testimonial.destroy({ where: { id } });
  return deleted > 0;
}

async function getFooterPublic() {
  const rows = await FooterData.findAll({ order: [['id', 'ASC']] });
  const footer = {};
  for (const r of rows) {
    const p = r.get({ plain: true });
    footer[p.data_key] = p.data_value;
    if (p.meta) footer[`${p.data_key}_meta`] = p.meta;
  }
  return footer;
}

async function getFooterInternal() {
  const rows = await FooterData.findAll({ order: [['data_key', 'ASC']] });
  return rows.map((r) => r.get({ plain: true }));
}

async function upsertFooter(key, data) {
  const { data_value, meta } = data;
  const [row, created] = await FooterData.findOrCreate({
    where: { data_key: key },
    defaults: { data_value: data_value ?? null, meta: meta || null },
  });
  if (!created) {
    await row.update({
      ...(data_value !== undefined && { data_value }),
      ...(meta !== undefined && { meta }),
    });
  }
  return row.get({ plain: true });
}

async function getPlansPublic() {
  const rows = await PremiumPlan.findAll({
    where: { is_active: true },
    order: [
      ['sort_order', 'ASC'],
      ['id', 'ASC'],
    ],
    attributes: ['id', 'name', 'slug', 'description', 'price', 'currency', 'duration_days', 'features', 'sort_order'],
  });
  return rows.map((r) => {
    const p = r.get({ plain: true });
    return { ...p, features: p.features || [] };
  });
}

async function getPlanBySlugPublic(slug) {
  const row = await PremiumPlan.findOne({
    where: { slug, is_active: true },
    attributes: ['id', 'name', 'slug', 'description', 'price', 'currency', 'duration_days', 'features', 'sort_order'],
  });
  if (!row) return null;
  const p = row.get({ plain: true });
  return { ...p, features: p.features || [] };
}

async function getPlansInternal() {
  const rows = await PremiumPlan.findAll({
    order: [
      ['sort_order', 'ASC'],
      ['id', 'ASC'],
    ],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function getPlanByIdInternal(id) {
  const row = await PremiumPlan.findByPk(id);
  if (!row) return null;
  const p = row.get({ plain: true });
  const [courseRows, catRows] = await Promise.all([
    PlanCourse.findAll({ where: { plan_id: id }, attributes: ['course_id'] }),
    PlanCourseCategory.findAll({ where: { plan_id: id }, attributes: ['course_cat_id'] }),
  ]);
  const course_ids = courseRows.map((r) => Number(r.course_id));
  const course_cat_ids = catRows.map((r) => Number(r.course_cat_id));
  return {
    ...p,
    features: p.features || [],
    course_ids,
    course_cat_ids,
  };
}

function slugify(text) {
  return (text || '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function createPlan(data) {
  const slugVal = data.slug || slugify(data.name);
  const row = await PremiumPlan.create({
    name: data.name || '',
    slug: slugVal,
    description: data.description || null,
    price: data.price ?? 0,
    currency: data.currency || 'INR',
    duration_days: data.duration_days ?? null,
    is_lifetime: data.is_lifetime !== undefined ? !!data.is_lifetime : false,
    features: data.features || null,
    sort_order: data.sort_order ?? 0,
    is_active: data.is_active !== undefined ? !!data.is_active : true,
  });
  const planId = row.id;
  const course_ids = Array.isArray(data.course_ids) ? data.course_ids : [];
  const course_cat_ids = Array.isArray(data.course_cat_ids) ? data.course_cat_ids : [];
  if (course_ids.length) {
    await PlanCourse.bulkCreate(course_ids.map((course_id) => ({ plan_id: planId, course_id })));
  }
  if (course_cat_ids.length) {
    await PlanCourseCategory.bulkCreate(course_cat_ids.map((course_cat_id) => ({ plan_id: planId, course_cat_id })));
  }
  const out = row.get({ plain: true });
  return { ...out, course_ids, course_cat_ids };
}

async function updatePlan(id, data) {
  const row = await PremiumPlan.findByPk(id);
  if (!row) return null;
  const updates = {};
  if (data.name !== undefined) updates.name = data.name;
  if (data.slug !== undefined) updates.slug = data.slug;
  if (data.description !== undefined) updates.description = data.description;
  if (data.price !== undefined) updates.price = data.price;
  if (data.currency !== undefined) updates.currency = data.currency;
  if (data.duration_days !== undefined) updates.duration_days = data.duration_days;
  if (data.is_lifetime !== undefined) updates.is_lifetime = !!data.is_lifetime;
  if (data.features !== undefined) updates.features = data.features;
  if (data.sort_order !== undefined) updates.sort_order = data.sort_order;
  if (data.is_active !== undefined) updates.is_active = !!data.is_active;
  await row.update(updates);
  if (data.course_ids !== undefined) {
    await PlanCourse.destroy({ where: { plan_id: id } });
    const ids = Array.isArray(data.course_ids) ? data.course_ids : [];
    if (ids.length) {
      await PlanCourse.bulkCreate(ids.map((course_id) => ({ plan_id: id, course_id })));
    }
  }
  if (data.course_cat_ids !== undefined) {
    await PlanCourseCategory.destroy({ where: { plan_id: id } });
    const ids = Array.isArray(data.course_cat_ids) ? data.course_cat_ids : [];
    if (ids.length) {
      await PlanCourseCategory.bulkCreate(ids.map((course_cat_id) => ({ plan_id: id, course_cat_id })));
    }
  }
  return getPlanByIdInternal(id);
}

async function deletePlan(id) {
  const deleted = await PremiumPlan.destroy({ where: { id } });
  return deleted > 0;
}

async function getArticlesPublic(limit, offset) {
  const rows = await Article.findAll({
    where: { status: 'publish' },
    order: [['published_at', 'DESC']],
    limit,
    offset,
    attributes: ['id', 'title', 'slug', 'excerpt', 'thumbnail_url', 'author_id', 'published_at', 'created_at'],
  });
  return rows.map((r) => {
    const p = r.get({ plain: true });
    return { ...p, cover_image_url: p.thumbnail_url, author_name: p.author_id };
  });
}

function extractRelatedIds(content) {
  if (typeof content !== 'string' || !content.length) return [];
  const ids = [];
  const re = /\[related\s+id="(\d+)"\]/gi;
  let m;
  while ((m = re.exec(content)) !== null) {
    const id = parseInt(m[1], 10);
    if (!Number.isNaN(id) && !ids.includes(id)) ids.push(id);
  }
  return ids;
}

async function resolveRelatedArticles(ids) {
  if (!Array.isArray(ids) || ids.length === 0) return [];
  const rows = await Article.findAll({
    where: { id: ids },
    attributes: ['id', 'title', 'slug'],
  });
  return rows.map((r) => {
    const p = r.get({ plain: true });
    return { id: p.id, title: p.title || '', slug: p.slug || '' };
  });
}

async function getArticleBySlugPublic(slug) {
  const row = await Article.findOne({
    where: { slug, status: 'publish' },
    attributes: [
      'id', 'title', 'slug', 'excerpt', 'content', 'thumbnail_url', 'author_id',
      'published_at', 'meta_title', 'meta_description', 'created_at', 'updated_at',
    ],
  });
  if (!row) return null;
  const p = row.get({ plain: true });
  const out = { ...p, body: p.content, cover_image_url: p.thumbnail_url, author_name: p.author_id };
  const relatedIds = extractRelatedIds(p.content);
  if (relatedIds.length) out.related_articles = await resolveRelatedArticles(relatedIds);
  return out;
}

const ARTICLE_LIST_ATTRS = ['id', 'title', 'slug', 'excerpt', 'thumbnail_url', 'author_id', 'status', 'published_at', 'created_at', 'updated_at'];
const SORTABLE_ARTICLE_COLUMNS = ['id', 'title', 'slug', 'created_at', 'updated_at', 'status', 'published_at'];

function buildArticlesWhere(options = {}) {
  const { status, search } = options;
  const where = {};
  if (status) where.status = status;
  if (search && String(search).trim()) {
    const term = `%${String(search).trim()}%`;
    where[Op.or] = [
      { title: { [Op.like]: term } },
      { excerpt: { [Op.like]: term } },
      { slug: { [Op.like]: term } },
    ];
  }
  return where;
}

function normalizeSortColumn(sortBy) {
  if (!sortBy || typeof sortBy !== 'string') return 'created_at';
  const col = sortBy.trim();
  return SORTABLE_ARTICLE_COLUMNS.includes(col) ? col : 'created_at';
}

async function getArticlesInternal(options = {}) {
  const {
    status,
    page = 1,
    limit = 10,
    search,
    sortBy,
    sortOrder = 'DESC',
  } = options;

  const where = buildArticlesWhere({ status, search });
  const orderColumn = normalizeSortColumn(sortBy);
  const orderDir = String(sortOrder).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const result = await paginate(Article, {
    where,
    page,
    limit,
    sortBy: orderColumn,
    sortOrder: orderDir,
    attributes: ARTICLE_LIST_ATTRS,
  });

  return result;
}

async function getArticleByIdInternal(id) {
  const row = await Article.findByPk(id);
  if (!row) return null;
  const p = row.get({ plain: true });
  const [catRows, tagRows, typeRows, courtRows, relatedArticles] = await Promise.all([
    ArticleCategoryMap.findAll({ where: { article_id: id }, attributes: ['category_id'] }),
    ArticleTagMap.findAll({ where: { article_id: id }, attributes: ['tag_id'] }),
    ArticleTypeMap.findAll({ where: { article_id: id }, attributes: ['article_type_id'] }),
    ArticleCourtMap.findAll({ where: { article_id: id }, attributes: ['court_id'] }),
    resolveRelatedArticles(extractRelatedIds(p.content)),
  ]);
  const result = {
    ...p,
    category_ids: catRows.map((r) => Number(r.category_id)),
    tag_ids: tagRows.map((r) => Number(r.tag_id)),
    article_type_ids: typeRows.map((r) => Number(r.article_type_id)),
    court_ids: courtRows.map((r) => Number(r.court_id)),
  };
  if (relatedArticles.length) result.related_articles = relatedArticles;
  return result;
}

async function createArticle(data) {
  const slugVal = data.slug || slugify(data.title);
  const row = await Article.create({
    title: data.title || '',
    slug: slugVal,
    excerpt: data.excerpt || null,
    content: data.content ?? data.body ?? null,
    thumbnail_url: data.thumbnail_url ?? data.cover_image_url ?? null,
    author_id: data.author_id ?? null,
    sub_heading: data.sub_heading ?? null,
    status: data.status || 'draft',
    published_at: data.published_at || null,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
    meta_keywords: data.meta_keywords || null,
  });
  const articleId = row.id;
  const category_ids = Array.isArray(data.category_ids) ? data.category_ids : [];
  const tag_ids = Array.isArray(data.tag_ids) ? data.tag_ids : [];
  const article_type_ids = Array.isArray(data.article_type_ids) ? data.article_type_ids : [];
  const court_ids = Array.isArray(data.court_ids) ? data.court_ids : [];
  if (category_ids.length) await ArticleCategoryMap.bulkCreate(category_ids.map((category_id) => ({ article_id: articleId, category_id })));
  if (tag_ids.length) await ArticleTagMap.bulkCreate(tag_ids.map((tag_id) => ({ article_id: articleId, tag_id })));
  if (article_type_ids.length) await ArticleTypeMap.bulkCreate(article_type_ids.map((article_type_id) => ({ article_id: articleId, article_type_id })));
  if (court_ids.length) await ArticleCourtMap.bulkCreate(court_ids.map((court_id) => ({ article_id: articleId, court_id })));
  return getArticleByIdInternal(articleId);
}

async function updateArticle(id, data) {
  const row = await Article.findByPk(id);
  if (!row) return null;
  const updates = {};
  if (data.title !== undefined) updates.title = data.title;
  if (data.slug !== undefined) updates.slug = data.slug;
  if (data.excerpt !== undefined) updates.excerpt = data.excerpt;
  if (data.content !== undefined) updates.content = data.content;
  if (data.body !== undefined) updates.content = data.body;
  if (data.thumbnail_url !== undefined) updates.thumbnail_url = data.thumbnail_url;
  if (data.cover_image_url !== undefined) updates.thumbnail_url = data.cover_image_url;
  if (data.author_id !== undefined) updates.author_id = data.author_id;
  if (data.sub_heading !== undefined) updates.sub_heading = data.sub_heading;
  if (data.status !== undefined) updates.status = data.status;
  if (data.published_at !== undefined) updates.published_at = data.published_at;
  if (data.meta_title !== undefined) updates.meta_title = data.meta_title;
  if (data.meta_description !== undefined) updates.meta_description = data.meta_description;
  if (data.meta_keywords !== undefined) updates.meta_keywords = data.meta_keywords;
  await row.update(updates);
  if (data.category_ids !== undefined) {
    await ArticleCategoryMap.destroy({ where: { article_id: id } });
    const ids = Array.isArray(data.category_ids) ? data.category_ids : [];
    if (ids.length) await ArticleCategoryMap.bulkCreate(ids.map((category_id) => ({ article_id: id, category_id })));
  }
  if (data.tag_ids !== undefined) {
    await ArticleTagMap.destroy({ where: { article_id: id } });
    const ids = Array.isArray(data.tag_ids) ? data.tag_ids : [];
    if (ids.length) await ArticleTagMap.bulkCreate(ids.map((tag_id) => ({ article_id: id, tag_id })));
  }
  if (data.article_type_ids !== undefined) {
    await ArticleTypeMap.destroy({ where: { article_id: id } });
    const ids = Array.isArray(data.article_type_ids) ? data.article_type_ids : [];
    if (ids.length) await ArticleTypeMap.bulkCreate(ids.map((article_type_id) => ({ article_id: id, article_type_id })));
  }
  if (data.court_ids !== undefined) {
    await ArticleCourtMap.destroy({ where: { article_id: id } });
    const ids = Array.isArray(data.court_ids) ? data.court_ids : [];
    if (ids.length) await ArticleCourtMap.bulkCreate(ids.map((court_id) => ({ article_id: id, court_id })));
  }
  return getArticleByIdInternal(id);
}

async function deleteArticle(id) {
  const deleted = await Article.destroy({ where: { id } });
  return deleted > 0;
}

async function getArticleCategories() {
  const rows = await Category.findAll({
    order: [['name', 'ASC']],
    attributes: ['id', 'name', 'slug'],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function getTagsInternal() {
  const rows = await Tag.findAll({
    order: [['name', 'ASC']],
    attributes: ['id', 'name', 'slug'],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function getArticleTypesInternal() {
  const rows = await ArticleType.findAll({
    order: [['name', 'ASC']],
    attributes: ['id', 'name', 'slug'],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function getCourtsInternal() {
  const rows = await Court.findAll({
    order: [['name', 'ASC']],
    attributes: ['id', 'name', 'slug'],
  });
  return rows.map((r) => r.get({ plain: true }));
}

module.exports = {
  home: {
    getHomePublic,
    getHomeSectionsInternal,
    upsertHomeSection,
  },
  states: {
    getStatesPublic,
    getStatesInternal,
    createState,
    updateState,
  },
  testimonials: {
    getTestimonialsPublic,
    getTestimonialsInternal,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  },
  footer: {
    getFooterPublic,
    getFooterInternal,
    upsertFooter,
  },
  plans: {
    getPlansPublic,
    getPlanBySlugPublic,
    getPlansInternal,
    getPlanByIdInternal,
    createPlan,
    updatePlan,
    deletePlan,
  },
  articles: {
    getArticlesPublic,
    getArticleBySlugPublic,
    getArticlesInternal,
    getArticleByIdInternal,
    createArticle,
    updateArticle,
    deleteArticle,
  },
  articleCategories: {
    getArticleCategories,
  },
  tags: { getTagsInternal },
  articleTypes: { getArticleTypesInternal },
  courts: { getCourtsInternal },
};
