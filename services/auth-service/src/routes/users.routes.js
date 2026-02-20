const express = require('express');
const usersController = require('../controllers/users.controller');

const router = express.Router();

router.post('/', usersController.create);
router.get('/', usersController.list);
router.get('/:id', usersController.getOne);
router.put('/:id', usersController.update);
router.delete('/:id', usersController.remove);

const register = (rootRouter) => {
    rootRouter.use('/users', router);
};

module.exports = { register };
