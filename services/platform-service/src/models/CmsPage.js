const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'CmsPage',
    {
      id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true, autoIncrement: true },
      slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      title: { type: DataTypes.STRING(500), allowNull: true },
      content: { type: DataTypes.TEXT('long'), allowNull: true },
      meta: { type: DataTypes.JSON, allowNull: true },
    },
    {
      tableName: 'cms_pages',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
