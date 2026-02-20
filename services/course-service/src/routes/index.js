const express = require('express');
const healthRoutes = require('./health.routes');
const coursesRoutes = require('./courses.routes');

const router = express.Router();

healthRoutes.register(router);
coursesRoutes.register(router);

module.exports = router;
