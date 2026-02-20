const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'HomeSection',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      section_key: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      title: { type: DataTypes.STRING(255), allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: true },
      meta: { type: DataTypes.JSON, allowNull: true },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: 'home_sections',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
