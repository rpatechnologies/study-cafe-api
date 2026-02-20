const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Recording = sequelize.define(
    'Recording',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      session_id: { type: DataTypes.INTEGER, allowNull: false },
      url: { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
      source: { type: DataTypes.STRING(255), allowNull: true },
    },
    {
      tableName: 'recordings',
      underscored: true,
      timestamps: false,
    }
  );
  Recording.associate = (models) => {
    Recording.belongsTo(models.Session, { foreignKey: 'session_id' });
  };
  return Recording;
};
