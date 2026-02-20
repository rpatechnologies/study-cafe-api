const config = require('./config');
const { createApp } = require('./app');

const app = createApp();
app.listen(config.port, () =>
  console.log(`API Gateway listening on ${config.port}`)
);
