const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define(
    'Role',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(64), allowNull: false },
    },
    { tableName: 'roles', underscored: true, timestamps: false }
  );
  Role.associate = (models) => {
    Role.hasMany(models.User, { foreignKey: 'role_id' });
  };
  return Role;
};
