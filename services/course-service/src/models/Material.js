const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Material = sequelize.define(
    'Material',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      course_id: { type: DataTypes.INTEGER, allowNull: false },
      title: { type: DataTypes.STRING(255), allowNull: true },
      url: { type: DataTypes.STRING(512), allowNull: false, defaultValue: '' },
      type: { type: DataTypes.STRING(64), allowNull: true },
    },
    {
      tableName: 'materials',
      underscored: true,
      timestamps: false,
    }
  );
  Material.associate = (models) => {
    Material.belongsTo(models.Course, { foreignKey: 'course_id' });
  };
  return Material;
};
