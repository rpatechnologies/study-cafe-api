const axios = require('axios');
const config = require('../config');

function createPlatformClient() {
  return axios.create({
    baseURL: config.platformServiceUrl,
    timeout: 10000,
    headers: { 'X-Internal-API-Key': config.internalApiKey },
  });
}

module.exports = { createPlatformClient };
