const ordersController = require('../controllers/orders.controller');
const { requireUserId } = require('../middleware');

function register(router) {
  router.post('/orders/create', requireUserId, ordersController.create);
  router.post('/orders/verify', requireUserId, ordersController.verify);
  router.get('/orders', requireUserId, ordersController.list);
  router.get('/orders/:orderId/invoice', requireUserId, ordersController.getInvoice);
}

module.exports = { register };
