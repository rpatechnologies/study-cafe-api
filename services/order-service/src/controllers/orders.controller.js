const ordersService = require('../services/orders.service');

async function create(req, res) {
  const userId = req.userId;
  const { type, entityId, amount, currency = 'INR' } = req.body;
  if (!type || !entityId || !amount) {
    return res.status(400).json({ error: 'type, entityId, amount required' });
  }
  if (!['course', 'membership'].includes(type)) {
    return res.status(400).json({ error: 'type must be course or membership' });
  }
  try {
    const result = await ordersService.createOrder(userId, { type, entityId, amount, currency });
    if (result.error) {
      if (result.code === 429) return res.status(429).json({ error: result.error });
      return res.status(503).json({ error: result.error });
    }
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
}

async function verify(req, res) {
  const userId = req.userId;
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  if (!orderId || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ error: 'orderId, razorpay_payment_id, razorpay_signature required' });
  }
  try {
    const result = await ordersService.verifyOrder(userId, {
      orderId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
    if (result.error) {
      if (result.status === 404) return res.status(404).json({ error: result.error });
      return res.status(400).json({ error: result.error });
    }
    if (result.success) return res.json(result);
    res.status(500).json({ error: 'Verification failed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
}

async function list(req, res) {
  try {
    const rows = await ordersService.listOrders(req.userId);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

async function getInvoice(req, res) {
  try {
    const invoice = await ordersService.getInvoice(req.userId, req.params.orderId);
    if (!invoice) return res.status(404).json({ error: 'Order not found' });
    res.json(invoice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
}

module.exports = {
  create,
  verify,
  list,
  getInvoice,
};
