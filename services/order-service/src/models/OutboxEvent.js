const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'OutboxEvent',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      aggregate_type: { type: DataTypes.STRING(64), allowNull: false },
      aggregate_id: { type: DataTypes.STRING(128), allowNull: false },
      event_type: { type: DataTypes.STRING(64), allowNull: false },
      payload: { type: DataTypes.JSON, allowNull: false },
      status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: 'pending' },
      processed_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      tableName: 'outbox_events',
      underscored: true,
      timestamps: false,
    }
  );
};
