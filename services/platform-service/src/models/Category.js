const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Category', {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        wp_term_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
        name: { type: DataTypes.STRING(200), allowNull: false },
        slug: { type: DataTypes.STRING(200), allowNull: true },
        parent_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    }, { tableName: 'categories', underscored: true, timestamps: false });
};
