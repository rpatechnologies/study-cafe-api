const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./middleware');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'));
  app.use(routes);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
