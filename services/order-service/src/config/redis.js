const Redis = require('redis');
const config = require('./index');

let client;

async function getRedis() {
  if (!client) {
    client = Redis.createClient({ url: config.redis.url });
    client.on('error', (err) => console.error('Redis error:', err));
    await client.connect();
  }
  return client;
}

module.exports = { getRedis };
