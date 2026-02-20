const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'CourseAuthor',
        {
            id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
            course_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
            user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
            sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
        },
        {
            tableName: 'course_authors',
            underscored: true,
            timestamps: false,
        }
    );
};
