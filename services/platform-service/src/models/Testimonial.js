const { DataTypes } = require('sequelize');

// Table columns: name, role, quote (migration create table); model matches DB.
module.exports = (sequelize) => {
  return sequelize.define(
    'Testimonial',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING(255), allowNull: false },
      role: { type: DataTypes.STRING(128), allowNull: true },
      quote: { type: DataTypes.TEXT, allowNull: false },
      avatar_url: { type: DataTypes.STRING(512), allowNull: true },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: 'testimonials',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );
};
