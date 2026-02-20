const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'PlanCourseCategory',
    {
      plan_id: { type: DataTypes.INTEGER, primaryKey: true },
      course_cat_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    },
    {
      tableName: 'plan_course_categories',
      underscored: true,
      timestamps: false,
    }
  );
};
