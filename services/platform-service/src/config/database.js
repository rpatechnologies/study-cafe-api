const models = require('../models');

module.exports = {
  ...models,
  connect: models.connect,
};
