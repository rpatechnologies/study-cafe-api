const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('ArticleTagMap', {
        article_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
        tag_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    }, { tableName: 'article_tags', underscored: true, timestamps: false });
};
