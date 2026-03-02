const path = require('path');
const express = require('express');
const cors = require('cors');
const { logger } = require('../../../shared');
const routes = require('./routes');
const { errorHandler } = require('./middleware');
const { uploadsDir } = require('./middleware/upload');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(logger.requestLogger);
  // Serve uploaded files at /platform/uploads (gateway will proxy /api/uploads -> here)
  app.use('/platform/uploads', express.static(uploadsDir));
  app.use(routes);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
