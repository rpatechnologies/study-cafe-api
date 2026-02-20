const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('ArticleCategoryMap', {
        article_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
        category_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    }, { tableName: 'article_categories', underscored: true, timestamps: false });
};
