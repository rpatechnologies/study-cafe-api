const axios = require('axios');

const courseClient = axios.create({
  baseURL: process.env.COURSE_SERVICE_URL || 'http://127.0.0.1:4002',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'x-internal-api-key': process.env.INTERNAL_API_KEY || '',
  },
});

// Unwrap internal service responses that use sendSuccess or sendPaginated
courseClient.interceptors.response.use((response) => {
  if (response.data && typeof response.data === 'object' && response.data.success === true && 'data' in response.data) {
    if ('meta' in response.data) {
      response.data = { data: response.data.data, ...response.data.meta };
    } else {
      response.data = response.data.data;
    }
  }
  return response;
});

module.exports = courseClient;
