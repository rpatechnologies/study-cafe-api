const { PaymentConfig } = require('../models');

async function getPaymentConfig() {
  const row = await PaymentConfig.findByPk(1);
  const c = row ? row.get({ plain: true }) : {};
  return { key_id: c.razorpay_key_id || '', key_secret: c.razorpay_key_secret || '' };
}

async function updatePaymentConfig({ razorpay_key_id, razorpay_key_secret }) {
  const [row] = await PaymentConfig.findOrCreate({
    where: { id: 1 },
    defaults: { razorpay_key_id: null, razorpay_key_secret: null },
  });
  await row.update({
    ...(razorpay_key_id !== undefined && { razorpay_key_id: razorpay_key_id || null }),
    ...(razorpay_key_secret !== undefined && { razorpay_key_secret: razorpay_key_secret || null }),
  });
  const updated = await PaymentConfig.findByPk(1);
  return { updated: true, key_id: updated?.razorpay_key_id || '' };
}

module.exports = {
  getPaymentConfig,
  updatePaymentConfig,
};