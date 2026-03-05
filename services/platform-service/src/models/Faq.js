const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define(
        'Faq',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            question: { type: DataTypes.TEXT, allowNull: false },
            answer: { type: DataTypes.TEXT, allowNull: false },
            is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
            sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
        },
        {
            tableName: 'faqs',
            underscored: true,
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
};
