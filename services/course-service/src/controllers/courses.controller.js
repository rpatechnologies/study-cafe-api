const coursesService = require('../services/courses.service');

async function list(req, res) {
  try {
    const rows = await coursesService.listPublished();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

async function getById(req, res) {
  try {
    const course = await coursesService.getById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
}

async function getSessions(req, res) {
  try {
    const result = await coursesService.getSessionsByCourseId(req.params.id);
    if (result === null) return res.status(404).json({ error: 'Course not found' });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
}

async function getMaterials(req, res) {
  try {
    const rows = await coursesService.getMaterialsByCourseId(req.params.id);
    if (rows === null) return res.status(404).json({ error: 'Course not found' });
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch materials' });
  }
}

async function createCourse(req, res) {
  try {
    const course = await coursesService.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create course' });
  }
}

async function updateCourse(req, res) {
  try {
    const course = await coursesService.update(req.params.id, req.body);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update course' });
  }
}

async function createBatch(req, res) {
  try {
    const batch = await coursesService.createBatch(req.params.id, req.body);
    res.status(201).json(batch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create batch' });
  }
}

async function updateBatch(req, res) {
  try {
    const batch = await coursesService.updateBatch(req.params.id, req.body);
    if (!batch) return res.status(404).json({ error: 'Batch not found' });
    res.json(batch);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update batch' });
  }
}

async function createSession(req, res) {
  try {
    const session = await coursesService.createSession(req.params.id, req.body);
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session' });
  }
}

async function updateSession(req, res) {
  try {
    const session = await coursesService.updateSession(req.params.id, req.body);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update session' });
  }
}

async function addRecording(req, res) {
  try {
    const recording = await coursesService.addRecording(req.params.id, req.body);
    res.status(201).json(recording);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add recording' });
  }
}

async function addMaterial(req, res) {
  try {
    const material = await coursesService.addMaterial(req.params.id, req.body);
    res.status(201).json(material);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add material' });
  }
}

async function listAllInternal(req, res) {
  try {
    const rows = await coursesService.listAll();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
}

async function listCourseCatsInternal(req, res) {
  try {
    const rows = await coursesService.listCourseCats();
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course categories' });
  }
}

module.exports = {
  list,
  getById,
  getSessions,
  getMaterials,
  createCourse,
  updateCourse,
  createBatch,
  updateBatch,
  createSession,
  updateSession,
  addRecording,
  addMaterial,
  listAllInternal,
  listCourseCatsInternal,
};
