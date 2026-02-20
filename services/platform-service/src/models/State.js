const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'State',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(100), allowNull: false },
      code: { type: DataTypes.STRING(20), allowNull: true },
      country_code: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'IN' },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: 'states',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
};
