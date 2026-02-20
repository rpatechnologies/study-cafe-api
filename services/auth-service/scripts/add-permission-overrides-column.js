const { sequelize } = require('../src/models');

async function run() {
  const [results] = await sequelize.query(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND COLUMN_NAME = 'permission_overrides'
  `);
  if (results.length > 0) {
    console.log('Column permission_overrides already exists.');
    process.exit(0);
    return;
  }
  await sequelize.query(`
    ALTER TABLE users ADD COLUMN permission_overrides JSON DEFAULT NULL
  `);
  console.log('Added column permission_overrides to users table.');
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
