const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('ArticleTypeMap', {
        article_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
        article_type_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    }, { tableName: 'article_types_map', underscored: true, timestamps: false });
};
