const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'PlanCourse',
    {
      plan_id: { type: DataTypes.INTEGER, primaryKey: true },
      course_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    },
    {
      tableName: 'plan_courses',
      underscored: true,
      timestamps: false,
    }
  );
};
