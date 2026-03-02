const crypto = require('crypto');
const { sequelize, Order, Payment, OutboxEvent } = require('../models');
const { getRedis } = require('../config/redis');
const { getRazorpayInstance, getRazorpayConfig } = require('./payment.service');
const { AppError } = require('../../../../shared');

function generateOrderId() {
  return 'ORD_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
}

async function createOrder(userId, { type, entityId, amount, currency = 'INR' }) {
  const razorpay = await getRazorpayInstance();
  if (!razorpay) throw new AppError('Payment not configured', 503);

  const orderId = generateOrderId();
  const amountPaise = Math.round(parseFloat(amount) * 100);
  const lockKey = `order:lock:${userId}:${type}:${entityId}`;
  const redis = await getRedis();
  const locked = await redis.set(lockKey, '1', { NX: true, EX: 30 });
  if (!locked) throw new AppError('Duplicate order in progress', 429);

  try {
    const order = await Order.create({
      order_id: orderId,
      user_id: userId,
      type,
      entity_id: String(entityId),
      amount,
      currency,
      status: 'pending',
    });
    const rpOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency,
      receipt: orderId,
      notes: { orderId, userId: String(userId), type, entityId: String(entityId) },
    });
    await order.update({ razorpay_order_id: rpOrder.id });
    await redis.del(lockKey);
    const config = await getRazorpayConfig();
    return {
      orderId,
      razorpayOrderId: rpOrder.id,
      amount: amountPaise,
      currency,
      key: config?.key_id,
    };
  } catch (err) {
    await redis.del(lockKey).catch(() => { });
    throw err;
  }
}

async function verifyOrder(userId, { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  const config = await getRazorpayConfig();
  if (!config) throw new AppError('Payment not configured', 503);
  const expected = crypto
    .createHmac('sha256', config.key_secret)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');
  if (expected !== razorpay_signature) throw new AppError('Invalid signature', 400);

  const t = await sequelize.transaction();
  try {
    const order = await Order.findOne({
      where: { order_id: orderId, user_id: userId },
      transaction: t,
    });
    if (!order) {
      await t.rollback();
      throw new AppError('Order not found', 404);
    }
    if (order.status === 'paid') {
      await t.rollback();
      return { alreadyPaid: true, message: 'Already paid' };
    }
    await order.update({ status: 'paid' }, { transaction: t });
    await Payment.create(
      {
        order_id: order.id,
        razorpay_payment_id,
        razorpay_signature,
        amount: order.amount,
        status: 'captured',
      },
      { transaction: t }
    );
    const payload = { userId: order.user_id, orderId };
    if (order.type === 'course') {
      payload.courseId = order.entity_id;
      await OutboxEvent.create(
        {
          aggregate_type: 'order',
          aggregate_id: orderId,
          event_type: 'COURSE_PURCHASED',
          payload,
        },
        { transaction: t }
      );
    } else if (order.type === 'membership') {
      const now = new Date();
      const expires = new Date(now);
      expires.setFullYear(expires.getFullYear() + 1);
      payload.membershipType = 'annual';
      payload.orderId = orderId;
      payload.startsAt = now.toISOString();
      payload.expiresAt = expires.toISOString();
      await OutboxEvent.create(
        {
          aggregate_type: 'order',
          aggregate_id: orderId,
          event_type: 'MEMBERSHIP_ACTIVATED',
          payload,
        },
        { transaction: t }
      );
    }
    await t.commit();
    return { verified: true };
  } catch (err) {
    await t.rollback();
    if (err.name === 'SequelizeUniqueConstraintError') return { verified: true };
    throw err;
  }
}

async function listOrders(userId) {
  const rows = await Order.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    attributes: ['order_id', 'type', 'entity_id', 'amount', 'currency', 'status', 'created_at'],
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function listAllOrders(limit = 100, offset = 0) {
  const rows = await Order.findAll({
    order: [['created_at', 'DESC']],
    attributes: ['id', 'order_id', 'user_id', 'type', 'entity_id', 'amount', 'currency', 'status', 'buyer_email', 'created_at'],
    limit: Math.min(Number(limit) || 100, 500),
    offset: Number(offset) || 0,
  });
  return rows.map((r) => r.get({ plain: true }));
}

async function getOrderByOrderId(orderId) {
  const order = await Order.findOne({
    where: { order_id: orderId },
  });
  if (!order) return null;
  const payment = await Payment.findOne({
    where: { order_id: order.id },
    order: [['id', 'DESC']],
  });
  const p = order.get({ plain: true });
  return {
    ...p,
    payment_id: payment ? payment.razorpay_payment_id : null,
  };
}

async function getInvoice(userId, orderId) {
  const order = await Order.findOne({
    where: { order_id: orderId, user_id: userId },
  });
  if (!order) return null;
  const payment = await Payment.findOne({
    where: { order_id: order.id },
    order: [['id', 'DESC']],
  });
  const p = order.get({ plain: true });
  return {
    orderId: p.order_id,
    type: p.type,
    entityId: p.entity_id,
    amount: p.amount,
    currency: p.currency,
    status: p.status,
    paidAt: p.created_at,
    paymentId: payment ? payment.razorpay_payment_id : null,
  };
}

module.exports = {
  createOrder,
  verifyOrder,
  listOrders,
  getInvoice,
  listAllOrders,
  getOrderByOrderId,
};