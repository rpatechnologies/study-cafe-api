const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CoursePageSetting = sequelize.define(
        'CoursePageSetting',
        {
            id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
            setting_key: { type: DataTypes.STRING(100), allowNull: false, unique: true },
            setting_value: { type: DataTypes.TEXT('long'), allowNull: true },
        },
        {
            tableName: 'sc_course_page_settings',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
    return CoursePageSetting;
};
