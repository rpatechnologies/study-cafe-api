const config = require('./config');
const { createApp } = require('./app');
const { connect } = require('./models');
const { startOutboxWorker } = require('./workers/outbox.worker');

const app = createApp();
connect()
  .then(() => {
    startOutboxWorker();
    app.listen(config.port, () =>
      console.log(`${config.serviceName} listening on ${config.port}`)
    );
  })
  .catch((err) => {
    console.error('Failed to start:', err);
    process.exit(1);
  });
