const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { router, proxyRoutes } = require('./routes');
const { errorHandler } = require('./middleware');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(morgan('combined'));
  app.use(router);
  proxyRoutes.register(app);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
