const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define(
    'Testimonial',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      author_name: { type: DataTypes.STRING(255), allowNull: false },
      author_role: { type: DataTypes.STRING(255), allowNull: true },
      content: { type: DataTypes.TEXT, allowNull: false },
      avatar_url: { type: DataTypes.STRING(512), allowNull: true },
      rating: { type: DataTypes.TINYINT.UNSIGNED, allowNull: true },
      is_featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      sort_order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    {
      tableName: 'testimonials',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
};
