const models = require('../models');
const config = require('./index');

module.exports = {
  ...models,
  async connect() {
    return models.connect();
  },
};
