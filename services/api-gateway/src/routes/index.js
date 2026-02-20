const express = require('express');
const healthRoutes = require('./health.routes');
const proxyRoutes = require('./proxy.routes');

const router = express.Router();
healthRoutes.register(router);

module.exports = { router, proxyRoutes };
