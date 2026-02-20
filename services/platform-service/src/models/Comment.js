const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Comment', {
        id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
        wp_comment_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
        article_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
        user_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
        author_name: { type: DataTypes.STRING(250), allowNull: true },
        author_email: { type: DataTypes.STRING(100), allowNull: true },
        content: { type: DataTypes.TEXT, allowNull: false },
        approved: { type: DataTypes.BOOLEAN, defaultValue: true },
        parent_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    }, {
        tableName: 'comments',
        underscored: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false,
    });
};
