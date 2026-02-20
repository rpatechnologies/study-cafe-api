const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Court', {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        wp_term_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
        name: { type: DataTypes.STRING(200), allowNull: false },
        slug: { type: DataTypes.STRING(200), allowNull: true },
    }, { tableName: 'courts', underscored: true, timestamps: false });
};
