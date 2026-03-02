const coursesService = require('../services/courses.service');
const { asyncHandler, AppError, sendSuccess, sendCreated } = require('../../../../shared');

const list = asyncHandler(async (req, res) => {
  const rows = await coursesService.listPublished();
  sendSuccess(res, rows);
});

const getById = asyncHandler(async (req, res) => {
  const course = await coursesService.getById(req.params.id);
  if (!course) throw new AppError('Course not found', 404);
  sendSuccess(res, course);
});

const getSessions = asyncHandler(async (req, res) => {
  const result = await coursesService.getSessionsByCourseId(req.params.id);
  if (result === null) throw new AppError('Course not found', 404);
  sendSuccess(res, result);
});

const getSessionsInternal = asyncHandler(async (req, res) => {
  const result = await coursesService.getSessionsByCourseIdInternal(req.params.id);
  if (result === null) throw new AppError('Course not found', 404);
  sendSuccess(res, result);
});

const getMaterials = asyncHandler(async (req, res) => {
  const rows = await coursesService.getMaterialsByCourseId(req.params.id);
  if (rows === null) throw new AppError('Course not found', 404);
  sendSuccess(res, rows);
});

const createCourse = asyncHandler(async (req, res) => {
  const course = await coursesService.create(req.body);
  sendCreated(res, course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await coursesService.update(req.params.id, req.body);
  if (!course) throw new AppError('Course not found', 404);
  sendSuccess(res, course);
});

const createBatch = asyncHandler(async (req, res) => {
  const batch = await coursesService.createBatch(req.params.id, req.body);
  sendCreated(res, batch);
});

const updateBatch = asyncHandler(async (req, res) => {
  const batch = await coursesService.updateBatch(req.params.id, req.body);
  if (!batch) throw new AppError('Batch not found', 404);
  sendSuccess(res, batch);
});

const createSession = asyncHandler(async (req, res) => {
  const session = await coursesService.createSession(req.params.id, req.body);
  sendCreated(res, session);
});

const updateSession = asyncHandler(async (req, res) => {
  const session = await coursesService.updateSession(req.params.id, req.body);
  if (!session) throw new AppError('Session not found', 404);
  sendSuccess(res, session);
});

const addRecording = asyncHandler(async (req, res) => {
  const recording = await coursesService.addRecording(req.params.id, req.body);
  sendCreated(res, recording);
});

const updateRecording = asyncHandler(async (req, res) => {
  const recording = await coursesService.updateRecording(req.params.id, req.body);
  if (!recording) throw new AppError('Recording not found', 404);
  sendSuccess(res, recording);
});

const addMaterial = asyncHandler(async (req, res) => {
  const material = await coursesService.addMaterial(req.params.id, req.body);
  sendCreated(res, material);
});

const listAllInternal = asyncHandler(async (req, res) => {
  const rows = await coursesService.listAll();
  sendSuccess(res, rows);
});

const listCourseCatsInternal = asyncHandler(async (req, res) => {
  const rows = await coursesService.listCourseCats();
  sendSuccess(res, rows);
});

const getByIdInternal = asyncHandler(async (req, res) => {
  const course = await coursesService.getByIdInternal(req.params.id);
  if (!course) throw new AppError('Course not found', 404);
  sendSuccess(res, course);
});

const getPageSettings = asyncHandler(async (req, res) => {
  const settings = await coursesService.getAllPageSettings();
  sendSuccess(res, settings);
});

const updatePageSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  if (!key) throw new AppError('Setting key is required', 400);
  const result = await coursesService.upsertPageSetting(key, value);
  sendSuccess(res, result);
});

module.exports = {
  list,
  getById,
  getSessions,
  getSessionsInternal,
  getMaterials,
  createCourse,
  updateCourse,
  createBatch,
  updateBatch,
  createSession,
  updateSession,
  addRecording,
  updateRecording,
  addMaterial,
  listAllInternal,
  listCourseCatsInternal,
  getByIdInternal,
  getPageSettings,
  updatePageSetting,
};
