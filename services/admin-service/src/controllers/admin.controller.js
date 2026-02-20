const { createCourseClient } = require('../clients/courseClient');
const { createPlatformClient } = require('../clients/platformClient');
const adminLogsService = require('../services/adminLogs.service');
const paymentConfigService = require('../services/paymentConfig.service');
const { getAdminId, getAdminRole } = require('../middleware');

function proxyError(res, err, fallbackMessage = 'Service error') {
  const status = err.response?.status || 500;
  const body = err.response?.data || { error: fallbackMessage };
  res.status(status).json(body);
}

async function me(req, res) {
  const adminId = getAdminId(req);
  if (!adminId) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ adminId, role: getAdminRole(req) });
}

async function getPaymentConfigInternal(req, res) {
  try {
    const data = await paymentConfigService.getPaymentConfig();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch config' });
  }
}

async function getStats(req, res) {
  try {
    const data = await adminLogsService.getStats();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

async function updatePaymentConfig(req, res) {
  const adminId = getAdminId(req);
  try {
    const { razorpay_key_id, razorpay_key_secret } = req.body;
    const result = await paymentConfigService.updatePaymentConfig({ razorpay_key_id, razorpay_key_secret });
    await adminLogsService.logAction(adminId, 'UPDATE_PAYMENT_CONFIG', 'payment_config', '1', {}, req.ip);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update config' });
  }
}

async function getLogs(req, res) {
  try {
    const rows = await adminLogsService.getLogs(100);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
}

async function createCourse(req, res) {
  const adminId = getAdminId(req);
  try {
    const { data } = await createCourseClient().post('/internal/courses', req.body);
    await adminLogsService.logAction(adminId, 'CREATE_COURSE', 'course', String(data.id), { title: data.title }, req.ip);
    res.status(201).json(data);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function updateCourse(req, res) {
  const adminId = getAdminId(req);
  try {
    const { data } = await createCourseClient().put(`/internal/courses/${req.params.id}`, req.body);
    await adminLogsService.logAction(adminId, 'UPDATE_COURSE', 'course', req.params.id, {}, req.ip);
    res.json(data);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function createBatch(req, res) {
  const adminId = getAdminId(req);
  try {
    const { data } = await createCourseClient().post(`/internal/courses/${req.params.id}/batches`, req.body);
    await adminLogsService.logAction(adminId, 'CREATE_BATCH', 'batch', String(data.id), { courseId: req.params.id }, req.ip);
    res.status(201).json(data);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function updateBatch(req, res) {
  const adminId = getAdminId(req);
  try {
    const { data } = await createCourseClient().put(`/internal/batches/${req.params.id}`, req.body);
    await adminLogsService.logAction(adminId, 'UPDATE_BATCH', 'batch', req.params.id, {}, req.ip);
    res.json(data);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function createSession(req, res) {
  const adminId = getAdminId(req);
  try {
    const { data } = await createCourseClient().post(`/internal/batches/${req.params.id}/sessions`, req.body);
    await adminLogsService.logAction(adminId, 'CREATE_SESSION', 'session', String(data.id), { batchId: req.params.id }, req.ip);
    res.status(201).json(data);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function updateSession(req, res) {
  const adminId = getAdminId(req);
  try {
    const { data } = await createCourseClient().put(`/internal/sessions/${req.params.id}`, req.body);
    await adminLogsService.logAction(adminId, 'UPDATE_SESSION', 'session', req.params.id, {}, req.ip);
    res.json(data);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function addRecording(req, res) {
  const adminId = getAdminId(req);
  try {
    const { data } = await createCourseClient().post(`/internal/sessions/${req.params.id}/recordings`, req.body);
    await adminLogsService.logAction(adminId, 'ADD_RECORDING', 'recording', String(data.id), { sessionId: req.params.id }, req.ip);
    res.status(201).json(data);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function addMaterial(req, res) {
  const adminId = getAdminId(req);
  try {
    const { data } = await createCourseClient().post(`/internal/courses/${req.params.id}/materials`, req.body);
    await adminLogsService.logAction(adminId, 'ADD_MATERIAL', 'material', String(data.id), { courseId: req.params.id }, req.ip);
    res.status(201).json(data);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function getCourses(req, res) {
  try {
    const { data } = await createCourseClient().get('/internal/courses');
    res.json(Array.isArray(data) ? data : data || []);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

async function getCourseCats(req, res) {
  try {
    const { data } = await createCourseClient().get('/internal/course-cats');
    res.json(Array.isArray(data) ? data : data || []);
  } catch (err) {
    proxyError(res, err, 'Course service error');
  }
}

function platformProxy(handler) {
  return async (req, res) => {
    try {
      const client = createPlatformClient();
      const result = await handler(client, req);
      if (result.status === 204) return res.status(204).send();
      if (result.status === 201) return res.status(201).json(result.data);
      res.json(result.data);
    } catch (err) {
      proxyError(res, err, 'Platform service error');
    }
  };
}

const platform = {
  getHome: platformProxy((c) => c.get('/internal/platform/home').then((r) => ({ data: r.data }))),
  putHome: platformProxy((c, req) => c.put(`/internal/platform/home/${req.params.key}`, req.body).then((r) => ({ data: r.data }))),
  getStates: platformProxy((c) => c.get('/internal/platform/states').then((r) => ({ data: r.data }))),
  postState: platformProxy((c, req) => c.post('/internal/platform/states', req.body).then((r) => ({ data: r.data, status: 201 }))),
  putState: platformProxy((c, req) => c.put(`/internal/platform/states/${req.params.id}`, req.body).then((r) => ({ data: r.data }))),
  getTestimonials: platformProxy((c) => c.get('/internal/platform/testimonials').then((r) => ({ data: r.data }))),
  postTestimonial: platformProxy((c, req) => c.post('/internal/platform/testimonials', req.body).then((r) => ({ data: r.data, status: 201 }))),
  putTestimonial: platformProxy((c, req) => c.put(`/internal/platform/testimonials/${req.params.id}`, req.body).then((r) => ({ data: r.data }))),
  deleteTestimonial: platformProxy((c, req) => c.delete(`/internal/platform/testimonials/${req.params.id}`).then(() => ({ status: 204 }))),
  getFooter: platformProxy((c) => c.get('/internal/platform/footer').then((r) => ({ data: r.data }))),
  putFooter: platformProxy((c, req) => c.put(`/internal/platform/footer/${req.params.key}`, req.body).then((r) => ({ data: r.data }))),
  getPlans: platformProxy((c) => c.get('/internal/platform/plans').then((r) => ({ data: r.data }))),
  getPlan: platformProxy((c, req) => c.get(`/internal/platform/plans/${req.params.id}`).then((r) => ({ data: r.data }))),
  postPlan: platformProxy((c, req) => c.post('/internal/platform/plans', req.body).then((r) => ({ data: r.data, status: 201 }))),
  putPlan: platformProxy((c, req) => c.put(`/internal/platform/plans/${req.params.id}`, req.body).then((r) => ({ data: r.data }))),
  deletePlan: platformProxy((c, req) => c.delete(`/internal/platform/plans/${req.params.id}`).then(() => ({ status: 204 }))),
  getArticles: platformProxy((c, req) => c.get('/internal/platform/articles', { params: req.query }).then((r) => ({ data: r.data }))),
  getArticle: platformProxy((c, req) => c.get(`/internal/platform/articles/${req.params.id}`).then((r) => ({ data: r.data }))),
  postArticle: platformProxy((c, req) => c.post('/internal/platform/articles', req.body).then((r) => ({ data: r.data, status: 201 }))),
  putArticle: platformProxy((c, req) => c.put(`/internal/platform/articles/${req.params.id}`, req.body).then((r) => ({ data: r.data }))),
  deleteArticle: platformProxy((c, req) => c.delete(`/internal/platform/articles/${req.params.id}`).then(() => ({ status: 204 }))),
  getArticleCategories: platformProxy((c) => c.get('/internal/platform/article-categories').then((r) => ({ data: r.data }))),
  getTags: platformProxy((c) => c.get('/internal/platform/tags').then((r) => ({ data: r.data }))),
  getArticleTypes: platformProxy((c) => c.get('/internal/platform/article-types').then((r) => ({ data: r.data }))),
  getCourts: platformProxy((c) => c.get('/internal/platform/courts').then((r) => ({ data: r.data }))),
};

module.exports = {
  me,
  getPaymentConfigInternal,
  getStats,
  updatePaymentConfig,
  getLogs,
  createCourse,
  updateCourse,
  createBatch,
  updateBatch,
  createSession,
  updateSession,
  addRecording,
  addMaterial,
  getCourses,
  getCourseCats,
  platform,
};
