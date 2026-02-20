const express = require('express');
const healthRoutes = require('./health.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

healthRoutes.register(router);
adminRoutes.register(router);

module.exports = router;
