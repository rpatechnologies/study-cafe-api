const Joi = require('joi');

// ── Param schemas ──────────────────────────────────────────────────

const idParam = {
    params: Joi.object({
        id: Joi.number().integer().positive().required(),
    }),
};

const slugParam = {
    params: Joi.object({
        slug: Joi.string().max(500).required(),
    }),
};

const keyParam = {
    params: Joi.object({
        key: Joi.string().max(255).required(),
    }),
};

// ── Home ────────────────────────────────────────────────────────────

const upsertHomeSection = {
    params: keyParam.params,
    body: Joi.object({
        value: Joi.alternatives().try(Joi.string(), Joi.object(), Joi.array()).required(),
        sort_order: Joi.number().integer().min(0),
        is_active: Joi.boolean(),
    }),
};

// ── States ──────────────────────────────────────────────────────────

const createState = {
    body: Joi.object({
        name: Joi.string().max(255).required(),
        code: Joi.string().max(10).allow('', null),
        is_active: Joi.boolean().default(true),
    }),
};

const updateState = {
    params: idParam.params,
    body: Joi.object({
        name: Joi.string().max(255),
        code: Joi.string().max(10).allow('', null),
        is_active: Joi.boolean(),
    }),
};

// ── Testimonials ────────────────────────────────────────────────────

const createTestimonial = {
    body: Joi.object({
        author_name: Joi.string().max(255).required(),
        author_designation: Joi.string().max(255).allow('', null),
        author_image: Joi.string().uri().allow('', null),
        content: Joi.string().required(),
        rating: Joi.number().integer().min(1).max(5).allow(null),
        is_featured: Joi.boolean().default(false),
        is_active: Joi.boolean().default(true),
        sort_order: Joi.number().integer().min(0),
    }),
};

const updateTestimonial = {
    params: idParam.params,
    body: Joi.object({
        author_name: Joi.string().max(255),
        author_designation: Joi.string().max(255).allow('', null),
        author_image: Joi.string().uri().allow('', null),
        content: Joi.string(),
        rating: Joi.number().integer().min(1).max(5).allow(null),
        is_featured: Joi.boolean(),
        is_active: Joi.boolean(),
        sort_order: Joi.number().integer().min(0),
    }),
};

// ── FAQs ────────────────────────────────────────────────────────────

const createFaq = {
    body: Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
        sort_order: Joi.number().integer().min(0),
        is_active: Joi.boolean().default(true),
    }),
};

const updateFaq = {
    params: idParam.params,
    body: Joi.object({
        question: Joi.string(),
        answer: Joi.string(),
        sort_order: Joi.number().integer().min(0),
        is_active: Joi.boolean(),
    }),
};

// ── Footer ──────────────────────────────────────────────────────────

const upsertFooter = {
    params: keyParam.params,
    body: Joi.object({
        value: Joi.alternatives().try(Joi.string(), Joi.object(), Joi.array()).required(),
    }),
};

// ── Plans ───────────────────────────────────────────────────────────

const createPlan = {
    body: Joi.object({
        name: Joi.string().max(255).required(),
        slug: Joi.string().max(255),
        description: Joi.string().allow('', null),
        price: Joi.number().min(0).required(),
        sale_price: Joi.number().min(0).allow(null),
        duration_days: Joi.number().integer().min(1),
        features: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null),
        is_active: Joi.boolean().default(true),
        sort_order: Joi.number().integer().min(0),
        courses: Joi.array().items(Joi.number().integer().positive()),
        categories: Joi.array().items(Joi.number().integer().positive()),
    }),
};

const updatePlan = {
    params: idParam.params,
    body: Joi.object({
        name: Joi.string().max(255),
        slug: Joi.string().max(255),
        description: Joi.string().allow('', null),
        price: Joi.number().min(0),
        sale_price: Joi.number().min(0).allow(null),
        duration_days: Joi.number().integer().min(1),
        features: Joi.alternatives().try(Joi.array(), Joi.string()).allow(null),
        is_active: Joi.boolean(),
        sort_order: Joi.number().integer().min(0),
        courses: Joi.array().items(Joi.number().integer().positive()),
        categories: Joi.array().items(Joi.number().integer().positive()),
    }),
};

// ── Articles ────────────────────────────────────────────────────────

const articleListQuery = {
    query: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        status: Joi.string().valid('draft', 'publish').allow('', null),
        search: Joi.string().max(255).allow('', null),
        sortBy: Joi.string().max(64).allow('', null),
        sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
    }),
};

const createArticle = {
    body: Joi.object({
        title: Joi.string().max(500).required(),
        slug: Joi.string().max(500),
        content: Joi.string().allow('', null),
        excerpt: Joi.string().allow('', null),
        thumbnail: Joi.string().uri().allow('', null),
        status: Joi.string().valid('draft', 'publish').default('draft'),
        seo_title: Joi.string().max(255).allow('', null),
        seo_description: Joi.string().allow('', null),
        seo_keywords: Joi.string().allow('', null),
        categories: Joi.array().items(Joi.number().integer().positive()),
        tags: Joi.array().items(Joi.number().integer().positive()),
        types: Joi.array().items(Joi.number().integer().positive()),
        courts: Joi.array().items(Joi.number().integer().positive()),
    }),
};

const updateArticle = {
    params: idParam.params,
    body: Joi.object({
        title: Joi.string().max(500),
        slug: Joi.string().max(500),
        content: Joi.string().allow('', null),
        excerpt: Joi.string().allow('', null),
        thumbnail: Joi.string().uri().allow('', null),
        status: Joi.string().valid('draft', 'publish'),
        seo_title: Joi.string().max(255).allow('', null),
        seo_description: Joi.string().allow('', null),
        seo_keywords: Joi.string().allow('', null),
        categories: Joi.array().items(Joi.number().integer().positive()),
        tags: Joi.array().items(Joi.number().integer().positive()),
        types: Joi.array().items(Joi.number().integer().positive()),
        courts: Joi.array().items(Joi.number().integer().positive()),
    }),
};

// ── CMS pages ────────────────────────────────────────────────────────

const upsertCmsPage = {
    params: slugParam.params,
    body: Joi.object({
        title: Joi.string().max(500).allow('', null),
        content: Joi.string().allow('', null),
        meta: Joi.object().unknown(true).allow(null),
    }),
};

const createSeoMetadata = {
    body: Joi.object({
        page_name: Joi.string().max(255).required(),
        page_slug: Joi.string().max(255).required(),
        meta_title: Joi.string().max(255).required(),
        meta_description: Joi.string().allow('', null),
        meta_keywords: Joi.string().max(500).allow('', null),
        canonical_url: Joi.string().max(500).allow('', null),
        og_title: Joi.string().max(255).allow('', null),
        og_description: Joi.string().allow('', null),
        og_image_url: Joi.string().max(500).allow('', null),
        robots: Joi.string().max(255).allow('', null),
    }),
};

const updateSeoMetadata = {
    params: idParam.params,
    body: Joi.object({
        page_name: Joi.string().max(255),
        page_slug: Joi.string().max(255),
        meta_title: Joi.string().max(255),
        meta_description: Joi.string().allow('', null),
        meta_keywords: Joi.string().max(500).allow('', null),
        canonical_url: Joi.string().max(500).allow('', null),
        og_title: Joi.string().max(255).allow('', null),
        og_description: Joi.string().allow('', null),
        og_image_url: Joi.string().max(500).allow('', null),
        robots: Joi.string().max(255).allow('', null),
    }),
};

module.exports = {
    idParam,
    slugParam,
    keyParam,
    upsertHomeSection,
    createState,
    updateState,
    createTestimonial,
    updateTestimonial,
    createFaq,
    updateFaq,
    upsertFooter,
    createPlan,
    updatePlan,
    articleListQuery,
    createArticle,
    updateArticle,
    upsertCmsPage,
    createSeoMetadata,
    updateSeoMetadata,
};
