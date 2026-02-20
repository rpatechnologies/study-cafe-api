const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'FooterData',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      data_key: { type: DataTypes.STRING(64), allowNull: false, unique: true },
      data_value: { type: DataTypes.TEXT, allowNull: true },
      meta: { type: DataTypes.JSON, allowNull: true },
    },
    {
      tableName: 'footer_data',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
