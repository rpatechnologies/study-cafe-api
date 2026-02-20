const axios = require('axios');
const Razorpay = require('razorpay');
const config = require('../config');

let cachedConfig = null;

async function getRazorpayConfig() {
  if (config.razorpay.keyId && config.razorpay.keySecret) {
    return { key_id: config.razorpay.keyId, key_secret: config.razorpay.keySecret };
  }
  try {
    const { data } = await axios.get(`${config.adminServiceUrl}/internal/payment-config`, {
      headers: { 'X-Internal-API-Key': config.internalApiKey },
      timeout: 5000,
    });
    cachedConfig = data;
    return data;
  } catch (_) {
    return cachedConfig || null;
  }
}

async function getRazorpayInstance() {
  const cfg = await getRazorpayConfig();
  if (!cfg || !cfg.key_id || !cfg.key_secret) return null;
  return new Razorpay({ key_id: cfg.key_id, key_secret: cfg.key_secret });
}

module.exports = {
  getRazorpayConfig,
  getRazorpayInstance,
};
