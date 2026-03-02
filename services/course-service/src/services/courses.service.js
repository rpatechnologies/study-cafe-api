const { Course, CourseCat, Batch, Session, Recording, Material, CoursePageSetting } = require('../models');

const coursesService = {
  async listPublished() {
    const rows = await Course.findAll({
      where: { is_published: true },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'title', 'brief_description', 'price', 'sale_price', 'thumbnail_url', 'is_published', 'created_at'],
    });
    return rows.map((r) => r.get({ plain: true }));
  },

  async listAll() {
    const rows = await Course.findAll({
      order: [['id', 'ASC']],
      attributes: ['id', 'title', 'brief_description', 'price', 'sale_price', 'thumbnail_url', 'is_published', 'created_at'],
    });
    return rows.map((r) => r.get({ plain: true }));
  },

  async listCourseCats() {
    const rows = await CourseCat.findAll({
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'slug'],
    });
    return rows.map((r) => r.get({ plain: true }));
  },

  async getById(id) {
    const row = await Course.findOne({
      where: { id, is_published: true },
    });
    return row ? row.get({ plain: true }) : null;
  },

  async getByIdInternal(id) {
    const row = await Course.findByPk(id);
    return row ? row.get({ plain: true }) : null;
  },

  async getSessionsByCourseId(courseId) {
    const course = await Course.findOne({
      where: { id: courseId, is_published: true },
      attributes: ['id'],
    });
    if (!course) return null;
    return this._getBatchesSessionsRecordings(courseId);
  },

  /** Same as getSessionsByCourseId but without is_published filter (for admin). */
  async getSessionsByCourseIdInternal(courseId) {
    const course = await Course.findByPk(courseId, { attributes: ['id'] });
    if (!course) return null;
    return this._getBatchesSessionsRecordings(courseId);
  },

  async _getBatchesSessionsRecordings(courseId) {
    const batches = await Batch.findAll({
      where: { course_id: courseId },
      order: [['start_date', 'ASC']],
      include: [
        {
          model: Session,
          as: 'Sessions',
          required: false,
          include: [{ model: Recording, as: 'Recordings', required: false }],
        },
      ],
    });

    const result = [];
    for (const b of batches) {
      const sessions = await Session.findAll({
        where: { batch_id: b.id },
        order: [['day_number', 'ASC']],
        include: [{ model: Recording, as: 'Recordings', required: false }],
      });
      result.push({
        id: b.id,
        name: b.name,
        start_date: b.start_date,
        end_date: b.end_date,
        meet_link: b.meet_link,
        sessions: sessions.map((s) => ({
          ...s.get({ plain: true }),
          recordings: (s.Recordings || []).map((r) => ({ id: r.id, url: r.url, source: r.source })),
        })),
      });
    }
    return result;
  },

  async getMaterialsByCourseId(courseId) {
    const course = await Course.findOne({
      where: { id: courseId, is_published: true },
      attributes: ['id'],
    });
    if (!course) return null;
    const rows = await Material.findAll({
      where: { course_id: courseId },
      order: [['id', 'ASC']],
      attributes: ['id', 'title', 'url', 'type'],
    });
    return rows.map((r) => r.get({ plain: true }));
  },

  async create(data) {
    const row = await Course.create({
      title: data.title || '',
      short_title: data.short_title || null,
      slug: data.slug || null,
      brief_description: data.brief_description || null,
      description: data.description || null,
      curriculum: data.curriculum || null,
      learn_outcomes: data.learn_outcomes || null,
      requirements: data.requirements || null,
      terms_conditions: data.terms_conditions || null,
      price: data.price ?? 0,
      sale_price: data.sale_price !== undefined ? data.sale_price : null,
      thumbnail_url: data.thumbnail_url || null,
      youtube_url: data.youtube_url || null,
      language: data.language || null,
      course_type: data.course_type || null,
      taxable: !!data.taxable,
      keywords: data.keywords || null,
      faqs: data.faqs || null,
      feedback: data.feedback || null,
      includes_info: data.includes_info || null,
      certifications: data.certifications || null,
      gateway: data.gateway || null,
      is_published: !!data.is_published,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
    });
    return row.get({ plain: true });
  },

  async update(id, data) {
    const row = await Course.findByPk(id);
    if (!row) return null;
    const updatableFields = [
      'title', 'short_title', 'slug', 'brief_description', 'description',
      'curriculum', 'learn_outcomes', 'requirements', 'terms_conditions',
      'price', 'sale_price', 'thumbnail_url', 'youtube_url', 'language',
      'course_type', 'taxable', 'keywords', 'faqs', 'feedback', 'includes_info',
      'certifications', 'gateway', 'is_published', 'start_date', 'end_date'
    ];
    const updatePayload = {};
    for (const field of updatableFields) {
      if (data[field] !== undefined) {
        updatePayload[field] = data[field];
      }
    }
    await row.update(updatePayload);
    return row.get({ plain: true });
  },

  async createBatch(courseId, data) {
    const { name, start_date, end_date, meet_link } = data;
    const row = await Batch.create({
      course_id: courseId,
      name: name || '',
      start_date: start_date || null,
      end_date: end_date || null,
      meet_link: meet_link || null,
    });
    return row.get({ plain: true });
  },

  async updateBatch(id, data) {
    const { name, start_date, end_date, meet_link } = data;
    const row = await Batch.findByPk(id);
    if (!row) return null;
    await row.update({
      ...(name !== undefined && { name }),
      ...(start_date !== undefined && { start_date }),
      ...(end_date !== undefined && { end_date }),
      ...(meet_link !== undefined && { meet_link }),
    });
    return row.get({ plain: true });
  },

  async createSession(batchId, data) {
    const { day_number, title, scheduled_at, meet_link } = data;
    const row = await Session.create({
      batch_id: batchId,
      day_number: day_number ?? 1,
      title: title || null,
      scheduled_at: scheduled_at || null,
      meet_link: meet_link || null,
    });
    return row.get({ plain: true });
  },

  async updateSession(id, data) {
    const { day_number, title, scheduled_at, meet_link } = data;
    const row = await Session.findByPk(id);
    if (!row) return null;
    await row.update({
      ...(day_number !== undefined && { day_number }),
      ...(title !== undefined && { title }),
      ...(scheduled_at !== undefined && { scheduled_at }),
      ...(meet_link !== undefined && { meet_link }),
    });
    return row.get({ plain: true });
  },

  async addRecording(sessionId, data) {
    const { url, source } = data;
    const row = await Recording.create({
      session_id: sessionId,
      url: url || '',
      source: source || null,
    });
    return row.get({ plain: true });
  },

  async updateRecording(recordingId, data) {
    const row = await Recording.findByPk(recordingId);
    if (!row) return null;
    const { url, source } = data;
    if (url !== undefined) row.url = url || '';
    if (source !== undefined) row.source = source || null;
    await row.save();
    return row.get({ plain: true });
  },

  async addMaterial(courseId, data) {
    const { title, url, type } = data;
    const row = await Material.create({
      course_id: courseId,
      title: title || null,
      url: url || '',
      type: type || null,
    });
    return row.get({ plain: true });
  },

  // ---- Course Page Settings ----
  async getAllPageSettings() {
    const rows = await CoursePageSetting.findAll({ order: [['setting_key', 'ASC']] });
    const result = {};
    for (const r of rows) {
      result[r.setting_key] = r.setting_value;
    }
    return result;
  },

  async getPageSetting(key) {
    const row = await CoursePageSetting.findOne({ where: { setting_key: key } });
    return row ? row.setting_value : null;
  },

  async upsertPageSetting(key, value) {
    const [row] = await CoursePageSetting.upsert(
      { setting_key: key, setting_value: value },
      { returning: true }
    );
    return row.get({ plain: true });
  },
};

module.exports = coursesService;
