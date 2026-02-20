const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    port: config.mysql.port,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: config.mysql.connectionLimit || 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      timestamps: false,
    },
  }
);

const Course = require('./Course')(sequelize);
const Batch = require('./Batch')(sequelize);
const Session = require('./Session')(sequelize);
const Recording = require('./Recording')(sequelize);
const Material = require('./Material')(sequelize);
const CourseCat = require('./CourseCat')(sequelize);
const CourseCategory = require('./CourseCategory')(sequelize);
const CourseAuthor = require('./CourseAuthor')(sequelize);
const Enrollment = require('./Enrollment')(sequelize);

Course.associate({ Batch, Material, CourseCat, CourseCategory, CourseAuthor, Enrollment });
Batch.associate({ Course, Session });
Session.associate({ Batch, Recording });
Recording.associate({ Session });
Material.associate({ Course });

const models = { Course, Batch, Session, Recording, Material, CourseCat, CourseCategory, CourseAuthor, Enrollment };

async function connect() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error('Sequelize auth failed:', err.message);
    throw err;
  }
}

module.exports = {
  sequelize,
  ...models,
  connect,
};
