const express = require('express');
const healthRoutes = require('./health.routes');
const platformRoutes = require('./platform.routes');

const router = express.Router();

healthRoutes.register(router);
platformRoutes.register(router);

module.exports = router;
