const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('ArticleCourtMap', {
        article_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
        court_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    }, { tableName: 'article_courts', underscored: true, timestamps: false });
};
