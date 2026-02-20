const axios = require('axios');
const config = require('../config');

function createCourseClient() {
  return axios.create({
    baseURL: config.courseServiceUrl,
    timeout: 10000,
    headers: { 'X-Internal-API-Key': config.internalApiKey },
  });
}

module.exports = { createCourseClient };
