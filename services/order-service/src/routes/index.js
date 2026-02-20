const express = require('express');
const healthRoutes = require('./health.routes');
const ordersRoutes = require('./orders.routes');

const router = express.Router();

healthRoutes.register(router);
ordersRoutes.register(router);

module.exports = router;
