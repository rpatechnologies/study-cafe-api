const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'CourseCategory',
        {
            course_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
            course_cat_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
        },
        {
            tableName: 'course_categories',
            underscored: true,
            timestamps: false,
        }
    );
};
