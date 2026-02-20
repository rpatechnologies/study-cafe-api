const axios = require('axios');
const { OutboxEvent } = require('../models');
const config = require('../config');

async function processEvent(record) {
  const { id, event_type, payload } = record;
  const data = typeof payload === 'string' ? JSON.parse(payload) : payload;
  try {
    if (event_type === 'COURSE_PURCHASED') {
      await axios.post(
        `${config.authServiceUrl}/access/grant-course`,
        {
          userId: data.userId,
          courseId: data.courseId,
          orderId: data.orderId,
        },
        { headers: { 'X-Internal-API-Key': config.internalApiKey }, timeout: 10000 }
      );
    } else if (event_type === 'MEMBERSHIP_ACTIVATED') {
      await axios.post(
        `${config.authServiceUrl}/access/grant-membership`,
        {
          userId: data.userId,
          membershipType: data.membershipType,
          orderId: data.orderId,
          startsAt: data.startsAt,
          expiresAt: data.expiresAt,
        },
        { headers: { 'X-Internal-API-Key': config.internalApiKey }, timeout: 10000 }
      );
    }
    await OutboxEvent.update(
      { status: 'processed', processed_at: new Date() },
      { where: { id } }
    );
  } catch (err) {
    console.error('Outbox process failed:', id, err.message);
    await OutboxEvent.update({ status: 'failed' }, { where: { id } });
  }
}

async function poll() {
  const rows = await OutboxEvent.findAll({
    where: { status: 'pending' },
    order: [['id', 'ASC']],
    limit: 10,
  });
  for (const row of rows) {
    await processEvent(row.get({ plain: true }));
  }
}

function startOutboxWorker() {
  const pollMs = config.outbox.pollMs;
  setInterval(poll, pollMs);
  poll();
  console.log('Outbox worker started');
}

module.exports = { startOutboxWorker, processEvent };
