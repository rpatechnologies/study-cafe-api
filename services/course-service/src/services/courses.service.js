const { Course, CourseCat, Batch, Session, Recording, Material } = require('../models');

const coursesService = {
  async listPublished() {
    const rows = await Course.findAll({
      where: { is_published: true },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'title', 'description', 'price', 'is_published', 'created_at'],
    });
    return rows.map((r) => r.get({ plain: true }));
  },

  async listAll() {
    const rows = await Course.findAll({
      order: [['id', 'ASC']],
      attributes: ['id', 'title', 'description', 'price', 'is_published', 'created_at'],
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
      attributes: ['id', 'title', 'description', 'price', 'is_published', 'created_at'],
    });
    return row ? row.get({ plain: true }) : null;
  },

  async getSessionsByCourseId(courseId) {
    const course = await Course.findOne({
      where: { id: courseId, is_published: true },
      attributes: ['id'],
    });
    if (!course) return null;

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
    const { title, description, price, is_published } = data;
    const row = await Course.create({
      title: title || '',
      description: description || null,
      price: price ?? 0,
      is_published: !!is_published,
    });
    return row.get({ plain: true });
  },

  async update(id, data) {
    const { title, description, price, is_published } = data;
    const row = await Course.findByPk(id);
    if (!row) return null;
    await row.update({
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(is_published !== undefined && { is_published: !!is_published }),
    });
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
};

module.exports = coursesService;
