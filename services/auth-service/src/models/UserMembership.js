const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'UserMembership',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      membership_type: { type: DataTypes.STRING(64), allowNull: false },
      order_id: { type: DataTypes.STRING(128), allowNull: true },
      starts_at: { type: DataTypes.DATE, allowNull: false },
      expires_at: { type: DataTypes.DATE, allowNull: false },
    },
    {
      tableName: 'user_memberships',
      underscored: true,
      timestamps: false,
    }
  );
};
