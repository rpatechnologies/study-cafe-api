const usersService = require('../services/users.service');
const { createCrudController } = require('../../../../shared');

const controller = createCrudController(usersService, { resourceName: 'User' });

module.exports = controller;
