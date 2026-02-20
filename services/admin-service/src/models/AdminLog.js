const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'AdminLog',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      admin_id: { type: DataTypes.INTEGER, allowNull: true },
      action: { type: DataTypes.STRING(128), allowNull: true },
      resource: { type: DataTypes.STRING(64), allowNull: true },
      resource_id: { type: DataTypes.STRING(64), allowNull: true },
      details: { type: DataTypes.JSON, allowNull: true },
      ip_address: { type: DataTypes.STRING(45), allowNull: true },
    },
    {
      tableName: 'admin_logs',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
};
